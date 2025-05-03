
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, UserRound } from "lucide-react";
import { useRepository } from '@/contexts/RepositoryContext';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userRepositories } = useRepository();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(values);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await updateProfile({ avatar: base64String });
        toast({
          title: "Avatar updated",
          description: "Your profile photo has been updated successfully",
        });
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Failed to update profile photo",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to log in to view your profile</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 cursor-pointer" onClick={handleAvatarClick}>
                    <Upload className="w-3 h-3 text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex justify-end">
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={logout} className="ml-auto">
                Logout
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="repositories">
          <Card>
            <CardHeader>
              <CardTitle>Your Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              {userRepositories.length > 0 ? (
                <div className="space-y-4">
                  {userRepositories.map((repo) => (
                    <div key={repo.id} className="p-4 border rounded-lg hover:bg-secondary">
                      <h3 className="font-semibold text-blue-600 dark:text-blue-400">{repo.name}</h3>
                      <p className="text-sm text-github-text">{repo.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                          {repo.language}
                        </span>
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You don't have any repositories yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserRound className="mt-1 w-4 h-4" />
                  <div>
                    <p className="text-sm"><span className="font-medium">You</span> created a repository <span className="text-blue-600 dark:text-blue-400">Bharat-CodeBase</span></p>
                    <p className="text-xs text-github-text">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserRound className="mt-1 w-4 h-4" />
                  <div>
                    <p className="text-sm"><span className="font-medium">You</span> starred <span className="text-blue-600 dark:text-blue-400">IndiaJS/react-components</span></p>
                    <p className="text-xs text-github-text">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
