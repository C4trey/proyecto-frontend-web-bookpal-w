import type { Book } from "../../types";
import BookCardVertical from "./BookCardVertical";

interface BookGridVerticalProps {
  books: Book[];
}

export default function BookGridVertical({ books }: BookGridVerticalProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron libros</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {books.map((book) => (
        <BookCardVertical key={book.id} book={book} />
      ))}
    </div>
  );
}
