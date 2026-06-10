 import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function UserTable({
    lines = [],
    onAdd,
    onEdit,
    onRequestDelete,
    deletingId,
    isLoading,
    canCreate = false,
    canUpdate = false,
    canDelete = false,
}) {
    const showActionColumn = canUpdate || canDelete;

    const [search, setSearch] = useState('');
    const filtered = lines.filter((l) => {
        const q = search.toLowerCase();
        return (
            l.line_number?.toLowerCase().includes(q)
        );
    });

    return (
        <>
        <div className="flex items-center gap-3 justify-between">
            <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search lines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9"
                />
            </div>
            {canCreate && (
                <Button className="gap-2" onClick={onAdd}>
                    <Plus />
                    Add Line
                </Button>
            )}
        </div>

        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">SL No</TableHead>
                        <TableHead>Line Number</TableHead>
                       
                        {showActionColumn && <TableHead>Action</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={showActionColumn ? 4 : 3} className="text-center text-muted-foreground">
                                Loading lines...
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && lines.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={showActionColumn ? 4 : 3} className="text-center text-muted-foreground">
                                No lines found.
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && filtered.length === 0 && lines.length > 0 && (
                        <TableRow>
                            <TableCell colSpan={showActionColumn ? 4 : 3} className="text-center text-muted-foreground">
                                No lines match your search.
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading &&
                        filtered.map((line, index) => (
                            <TableRow key={line.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{line.line_number}</TableCell>
                                {showActionColumn && (
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {canUpdate && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Edit ${line.line_number}`}
                                                            onClick={() => onEdit?.(line.id ?? line.line_id)}
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p>Edit</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        {canDelete && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Delete ${line.line_number}`}
                                                            onClick={() => onRequestDelete?.(line)}
                                                            disabled={deletingId === line.id}
                                                        >
                                                            <Trash2 className="text-destructive" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p>Delete</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </TableCell>
                                )}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Card>
        </>
    )
}