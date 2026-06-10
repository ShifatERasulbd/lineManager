import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function EditForm({
    form = {},
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    errors = {},
    avatarPreview = '',
    submitLabel = 'Update Line',
    submittingLabel = 'Updating...',
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Line</CardTitle>
                <CardDescription>Update line details.</CardDescription>
            </CardHeader>
            <Separator />

            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6 pt-6">
                  
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-line-number">Line Number</Label>
                            <Input
                                id="edit-line-number"
                                name="line_number"
                                value={form.line_number || ''}
                                onChange={onChange}
                                placeholder="e.g. Line 1"
                            />
                            {errors.line_number && <p className="text-xs text-destructive">{errors.line_number[0]}</p>}
                        </div>

                     
                    </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-end gap-3 pt-6">
                    <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? submittingLabel : submitLabel}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
