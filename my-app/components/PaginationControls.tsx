import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
  onNewPage: () => void
  onDeletePage?: () => void
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  onNewPage,
  onDeletePage,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
          aria-label="Previous page"
        >
          Previous
        </Button>

        <span className="text-sm font-medium text-gray-300">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
          aria-label="Next page"
        >
          Next
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onNewPage}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 flex-1"
          aria-label="Add new page"
        >
          Add New Page
        </Button>

        {onDeletePage && totalPages > 1 && (
          <Button
            onClick={onDeletePage}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1"
            aria-label="Delete current page"
          >
            Delete Page
          </Button>
        )}
      </div>
    </div>
  )
}

