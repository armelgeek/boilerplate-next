import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React from 'react';
import { BlogDashboard } from '@/features/blog/components/organisms/blog-dashboard';

export default async function Overview() {

    return (
        <div className='space-y-4'>
        
            <div className='space-y-4'>
                <div className='flex flex-col space-y-2'>
                    <h2 className="font-semibold text-xl tracking-tight">Blog Overview</h2>
                    <p className="text-muted-foreground text-sm">
                        Monitor your blog content and engagement metrics.
                    </p>
                </div>
                <BlogDashboard />
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                     
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}