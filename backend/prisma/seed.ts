import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all(
    [
      { name: 'Computer Science', sortOrder: 1 },
      { name: 'Literature', sortOrder: 2 },
      { name: 'Business', sortOrder: 3 },
      { name: 'History', sortOrder: 4 },
      { name: 'Design', sortOrder: 5 },
      { name: 'Children', sortOrder: 6 },
      { name: 'Language', sortOrder: 7 },
      { name: 'Art', sortOrder: 8 },
    ].map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      }),
    ),
  );

  console.log(`Seeded ${categories.length} categories`);

  // Seed admin user
  const admin = await prisma.user.upsert({
    where: { openid: 'admin-openid-placeholder' },
    update: {},
    create: {
      openid: 'admin-openid-placeholder',
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`Seeded admin user: ${admin.name} (id=${admin.id})`);

  // Seed normal user
  const user = await prisma.user.upsert({
    where: { openid: 'user-openid-placeholder' },
    update: {},
    create: {
      openid: 'user-openid-placeholder',
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log(`Seeded normal user: ${user.name} (id=${user.id})`);

  // Seed books
  const csCategory = categories.find((c) => c.name === 'Computer Science')!;
  const litCategory = categories.find((c) => c.name === 'Literature')!;
  const bizCategory = categories.find((c) => c.name === 'Business')!;
  const histCategory = categories.find((c) => c.name === 'History')!;
  const designCategory = categories.find((c) => c.name === 'Design')!;
  const langCategory = categories.find((c) => c.name === 'Language')!;
  const artCategory = categories.find((c) => c.name === 'Art')!;
  const childCategory = categories.find((c) => c.name === 'Children')!;

  const booksData = [
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publisher: 'Prentice Hall', description: 'A handbook of agile software craftsmanship', totalCount: 5, availableCount: 5, location: 'A-01-01', categoryId: csCategory.id },
    { title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', publisher: 'Addison-Wesley', description: 'Elements of reusable object-oriented software', totalCount: 3, availableCount: 3, location: 'A-01-02', categoryId: csCategory.id },
    { title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', isbn: '9780135957059', publisher: 'Addison-Wesley', description: 'Your journey to mastery', totalCount: 4, availableCount: 4, location: 'A-01-03', categoryId: csCategory.id },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', publisher: 'MIT Press', description: 'The comprehensive textbook on algorithms', totalCount: 3, availableCount: 3, location: 'A-01-04', categoryId: csCategory.id },
    { title: 'Refactoring', author: 'Martin Fowler', isbn: '9780134757599', publisher: 'Addison-Wesley', description: 'Improving the design of existing code', totalCount: 3, availableCount: 3, location: 'A-01-05', categoryId: csCategory.id },
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '9780596517748', publisher: "O'Reilly", description: 'Unearthing the excellence in JavaScript', totalCount: 4, availableCount: 4, location: 'A-01-06', categoryId: csCategory.id },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '9781491950296', publisher: "O'Reilly", description: 'Deep dive into JavaScript core mechanisms', totalCount: 3, availableCount: 3, location: 'A-01-07', categoryId: csCategory.id },
    { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', isbn: '9780262510875', publisher: 'MIT Press', description: 'Classic CS textbook', totalCount: 2, availableCount: 2, location: 'A-01-08', categoryId: csCategory.id },

    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', publisher: 'Penguin', description: 'A romantic novel of manners', totalCount: 4, availableCount: 4, location: 'B-01-01', categoryId: litCategory.id },
    { title: '1984', author: 'George Orwell', isbn: '9780451524935', publisher: 'Signet Classic', description: 'A dystopian social science fiction novel', totalCount: 5, availableCount: 5, location: 'B-01-02', categoryId: litCategory.id },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780060935467', publisher: 'HarperCollins', description: 'A novel about racial injustice', totalCount: 3, availableCount: 3, location: 'B-01-03', categoryId: litCategory.id },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', publisher: 'Scribner', description: 'A story of the Jazz Age', totalCount: 3, availableCount: 3, location: 'B-01-04', categoryId: litCategory.id },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', isbn: '9780060883287', publisher: 'Harper', description: 'A landmark magical realism novel', totalCount: 2, availableCount: 2, location: 'B-01-05', categoryId: litCategory.id },
    { title: 'Brave New World', author: 'Aldous Huxley', isbn: '9780060850524', publisher: 'Harper', description: 'A dystopian future novel', totalCount: 3, availableCount: 3, location: 'B-01-06', categoryId: litCategory.id },

    { title: 'The Lean Startup', author: 'Eric Ries', isbn: '9780307887894', publisher: 'Crown Business', description: 'How to build a modern business', totalCount: 4, availableCount: 4, location: 'C-01-01', categoryId: bizCategory.id },
    { title: 'Zero to One', author: 'Peter Thiel', isbn: '9780804139298', publisher: 'Crown Business', description: 'Notes on startups', totalCount: 3, availableCount: 3, location: 'C-01-02', categoryId: bizCategory.id },
    { title: 'Good to Great', author: 'Jim Collins', isbn: '9780066620992', publisher: 'Harper Business', description: 'Why some companies make the leap', totalCount: 3, availableCount: 3, location: 'C-01-03', categoryId: bizCategory.id },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '9780374533557', publisher: 'Farrar Straus and Giroux', description: 'Two systems that drive the way we think', totalCount: 4, availableCount: 4, location: 'C-01-04', categoryId: bizCategory.id },

    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', publisher: 'Harper', description: 'A brief history of humankind', totalCount: 4, availableCount: 4, location: 'D-01-01', categoryId: histCategory.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', publisher: 'W. W. Norton', description: 'The fates of human societies', totalCount: 2, availableCount: 2, location: 'D-01-02', categoryId: histCategory.id },
    { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', isbn: '9780767908184', publisher: 'Broadway Books', description: 'A journey through science history', totalCount: 3, availableCount: 3, location: 'D-01-03', categoryId: histCategory.id },

    { title: 'The Design of Everyday Things', author: 'Don Norman', isbn: '9780465050659', publisher: 'Basic Books', description: 'Principles of good design', totalCount: 4, availableCount: 4, location: 'E-01-01', categoryId: designCategory.id },
    { title: 'Don\'t Make Me Think', author: 'Steve Krug', isbn: '9780321965516', publisher: 'New Riders', description: 'A guide to web usability', totalCount: 3, availableCount: 3, location: 'E-01-02', categoryId: designCategory.id },

    { title: 'English Grammar in Use', author: 'Raymond Murphy', isbn: '9781108457651', publisher: 'Cambridge', description: 'A self-study reference and practice book', totalCount: 5, availableCount: 5, location: 'F-01-01', categoryId: langCategory.id },
    { title: 'Word Power Made Easy', author: 'Norman Lewis', isbn: '9781101873854', publisher: 'Anchor', description: 'The complete handbook for building a superior vocabulary', totalCount: 3, availableCount: 3, location: 'F-01-02', categoryId: langCategory.id },

    { title: 'The Story of Art', author: 'E.H. Gombrich', isbn: '9780714832470', publisher: 'Phaidon', description: 'The most famous and popular book on art', totalCount: 2, availableCount: 2, location: 'G-01-01', categoryId: artCategory.id },
    { title: 'Ways of Seeing', author: 'John Berger', isbn: '9780140135152', publisher: 'Penguin', description: 'A revolutionary approach to visual art', totalCount: 3, availableCount: 3, location: 'G-01-02', categoryId: artCategory.id },

    { title: 'Charlotte\'s Web', author: 'E.B. White', isbn: '9780064400558', publisher: 'HarperCollins', description: 'A classic children\'s novel', totalCount: 4, availableCount: 4, location: 'H-01-01', categoryId: childCategory.id },
    { title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', isbn: '9780156012195', publisher: 'Mariner Books', description: 'A poetic tale about a young prince', totalCount: 5, availableCount: 5, location: 'H-01-02', categoryId: childCategory.id },
  ];

  for (const bookData of booksData) {
    if (bookData.isbn) {
      await prisma.book.upsert({
        where: { isbn: bookData.isbn },
        update: {},
        create: bookData,
      });
    } else {
      await prisma.book.create({ data: bookData });
    }
  }
  console.log(`Seeded ${booksData.length} books`);

  // Seed sample borrow records
  const allBooks = await prisma.book.findMany({ take: 5 });
  for (const book of allBooks.slice(0, 3)) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await prisma.borrowRecord.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate,
        status: 'BORROWED',
      },
    });

    await prisma.book.update({
      where: { id: book.id },
      data: { availableCount: { decrement: 1 } },
    });
  }

  // Add a returned record
  if (allBooks.length > 3) {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() - 5);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 25);

    await prisma.borrowRecord.create({
      data: {
        userId: user.id,
        bookId: allBooks[3].id,
        borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        dueDate,
        returnDate,
        status: 'RETURNED',
      },
    });
  }

  console.log('Seeded sample borrow records');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
