import { Skeleton } from "../ui/skeleton";

export default function TableSkeleton() {
    return (
        <div>
            <div className="border rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {["Task", "Title", "Status", "Priority", "Created At"].map(
                                (header, idx) => (
                                    <th key={idx} className="p-3 text-left">
                                        <Skeleton className="h-7 w-3/4" />
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-t">
                                {Array.from({ length: 5}).map((_, colIdx) => (
                                    <td key={colIdx} className="p-3">
                                        <Skeleton className="h-5 w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}