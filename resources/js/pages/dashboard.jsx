import { useEffect, useState } from 'react';

import { HeaderCard } from '@/components/dashboard/Header-Card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { fetchUsers } from '@/pages/User/api';

export default function Dashboard() {
    const { setPageTitle, user } = useAppContext();
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        setPageTitle('Dashboard');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadUsersCount() {
            try {
                const users = await fetchUsers();
                if (!ignore) {
                    setTotalUsers(Array.isArray(users) ? users.length : 0);
                }
            } catch {
                if (!ignore) {
                    setTotalUsers(0);
                }
            }
        }

        loadUsersCount();

        return () => {
            ignore = true;
        };
    }, []);

    const assignedLines = Array.isArray(user?.lines) ? user.lines : [];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1">
                <HeaderCard totalUsers={totalUsers} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">My Assigned Lines</CardTitle>
                </CardHeader>
                <CardContent>
                    {assignedLines.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No lines assigned to your account.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {assignedLines.map((line) => (
                                <span
                                    key={line.id}
                                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                                >
                                    {line.line_number}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
