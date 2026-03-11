const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const prisma = new PrismaClient();

// Convert Excel serial date to JS Date
function excelDateToJS(serial) {
  const epoch = new Date(1899, 11, 30);
  return new Date(epoch.getTime() + serial * 86400000);
}

async function importBooks() {
  const wb = XLSX.readFile('../book_list (25).xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`Importing ${rows.length} books...`);

  let imported = 0;
  for (const row of rows) {
    try {
      await prisma.book.create({
        data: {
          title: String(row.title || '').trim(),
          author: String(row.author || 'Unknown').trim(),
          isbn: row.isbn ? String(row.isbn).trim() : null,
          location: row.catNo ? String(row.catNo).trim() : null,
          publisher: row.year ? String(row.year).trim() : null,
          totalCount: 1,
          availableCount: row.available === 'Yes' ? 1 : 0,
          status: row.available === 'Yes' ? 'AVAILABLE' : 'DISABLED',
        },
      });
      imported++;
    } catch (e) {
      // Skip duplicates (isbn unique constraint)
      if (e.code === 'P2002') {
        console.log(`  Skipped duplicate ISBN: ${row.isbn} - ${row.title}`);
      } else {
        console.error(`  Error importing "${row.title}":`, e.message);
      }
    }
  }
  console.log(`Books imported: ${imported}/${rows.length}`);
}

async function importTransactions() {
  const wb = XLSX.readFile('../transactions_2026-02-06.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`\nImporting ${rows.length} borrow records...`);

  // Cache users by name+contact to avoid duplicate creation
  const userCache = new Map();
  let imported = 0;

  for (const row of rows) {
    try {
      const borrowerName = String(row.borrower_name || 'Unknown').trim();
      const borrowerContact = row.borrower_contact ? String(row.borrower_contact).trim() : null;
      const userKey = `${borrowerName}_${borrowerContact}`;

      // Find or create user
      let user;
      if (userCache.has(userKey)) {
        user = userCache.get(userKey);
      } else {
        // Try to find existing user by phone
        if (borrowerContact) {
          user = await prisma.user.findFirst({ where: { phone: borrowerContact } });
        }
        if (!user) {
          user = await prisma.user.create({
            data: {
              openid: `imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              name: borrowerName,
              phone: borrowerContact,
            },
          });
        }
        userCache.set(userKey, user);
      }

      // Find book by title
      const bookTitle = String(row.book__title || '').trim();
      const book = await prisma.book.findFirst({ where: { title: bookTitle } });

      if (!book) {
        // Try matching by catNo/location
        const catNo = row.book__catNo ? String(row.book__catNo).trim() : null;
        const bookByCat = catNo ? await prisma.book.findFirst({ where: { location: catNo } }) : null;
        if (!bookByCat) {
          console.log(`  Book not found: "${bookTitle}" (catNo: ${row.book__catNo})`);
          continue;
        }
        // Use book found by catNo
        const borrowDate = excelDateToJS(row.date_borrowed);
        const dueDate = excelDateToJS(row.due_date);
        await prisma.borrowRecord.create({
          data: {
            userId: user.id,
            bookId: bookByCat.id,
            borrowDate,
            dueDate,
            status: dueDate < new Date() ? 'OVERDUE' : 'BORROWED',
          },
        });
        imported++;
        continue;
      }

      const borrowDate = excelDateToJS(row.date_borrowed);
      const dueDate = excelDateToJS(row.due_date);

      await prisma.borrowRecord.create({
        data: {
          userId: user.id,
          bookId: book.id,
          borrowDate,
          dueDate,
          status: dueDate < new Date() ? 'OVERDUE' : 'BORROWED',
        },
      });
      imported++;
    } catch (e) {
      console.error(`  Error importing record for "${row.book__title}":`, e.message);
    }
  }
  console.log(`Borrow records imported: ${imported}/${rows.length}`);
}

async function main() {
  try {
    await importBooks();
    await importTransactions();

    // Print summary
    const bookCount = await prisma.book.count();
    const userCount = await prisma.user.count();
    const recordCount = await prisma.borrowRecord.count();
    console.log(`\n--- Summary ---`);
    console.log(`Total books: ${bookCount}`);
    console.log(`Total users: ${userCount}`);
    console.log(`Total borrow records: ${recordCount}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
