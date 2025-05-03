
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languageColors = {
  'TypeScript': '#2b7489',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Ruby': '#701516',
  'C#': '#178600',
  'PHP': '#4F5D95',
  'CSS': '#563d7c',
  'HTML': '#e34c26',
  'Other': '#ededed'
};

const repositorySchema = z.object({
  name: z.string()
    .min(1, { message: "Repository name is required" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Only letters, numbers, hyphens, and underscores are allowed" }),
  description: z.string().optional(),
  language: z.string(),
  isPrivate: z.boolean().default(false),
});

interface RepositoryFormProps {
  initialData?: {
    name: string;
    description?: string;
    language: string;
    isPrivate: boolean;
  };
  onSubmit: (data: z.infer<typeof repositorySchema>) => void;
  isLoading?: boolean;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({ initialData, onSubmit, isLoading = false }) => {
  const form = useForm<z.infer<typeof repositorySchema>>({
    resolver: zodResolver(repositorySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      language: "TypeScript",
      isPrivate: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository Name</FormLabel>
              <FormControl>
                <Input placeholder="my-awesome-project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A short description of your repository"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Language</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(languageColors).map(language => (
                    <SelectItem key={language} value={language}>
                      <div className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: languageColors[language as keyof typeof languageColors] }}
                        />
                        {language}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Private Repository</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Private repositories are only visible to you
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : initialData ? 'Update Repository' : 'Create Repository'}
        </Button>
      </form>
    </Form>
  );
};

export default RepositoryForm;
