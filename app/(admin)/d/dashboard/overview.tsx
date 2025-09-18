import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React from 'react';
import { EnhancedBlogDashboard } from '@/features/blog/components/organisms/enhanced-blog-dashboard';

export default async function Overview() {

    return (
        <div className='space-y-6'>
            {/* Enhanced Blog Overview */}
            <EnhancedBlogDashboard />

            {/* Additional Dashboard Sections */}
            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Revenue chart would go here */}
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            Revenue chart coming soon...
                        </div>
                    </CardContent>
                </Card>
                
                <Card className='col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>System overview metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            Additional metrics coming soon...
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}