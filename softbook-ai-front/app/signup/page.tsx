'use client';

import React from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <nav className="p-4">
                <Link href="/">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        ← Home
                    </Button>
                </Link>
            </nav>
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Sign Up for Softbook AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    disabled
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled>
                                Sign Up (Disabled)
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
