'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createCompanionAction } from '@/lib/actions';
import { useCompanion } from '@/hooks/use-companion';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(50, 'Name cannot exceed 50 characters.'),
  gender: z.enum(['Masculino', 'Femenino'], { required_error: 'Please select a gender.' }),
  age: z.coerce.number({ required_error: 'Age is required.' }).int().min(18, 'Must be at least 18.').max(100, 'Age cannot exceed 100.'),
  hobbies: z.string().min(3, 'Hobbies must be at least 3 characters.').max(200, 'Hobbies cannot exceed 200 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(500, 'Description cannot exceed 500 characters.'),
  difficulty: z.enum(['Easy', 'Hard', 'Expert', 'Ultra Hard'], { required_error: 'Please select a difficulty.' }),
});

export default function CreateCompanionForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { saveCompanion } = useCompanion();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      hobbies: '',
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await createCompanionAction(formData);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: result.error,
        });
      } else if (result.success && result.companion) {
        saveCompanion(result.companion);
        toast({
          title: 'Companion Created!',
          description: `Get ready to meet ${result.companion.name}.`,
        });
        router.push('/chat');
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Create Your Companion</CardTitle>
        <CardDescription>Design the personality and background of your new AI friend.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lucia, Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobbies</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Reading, hiking, playing piano" {...field} />
                  </FormControl>
                  <FormDescription>Separate hobbies with a comma.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backstory / Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe their personality, what makes them unique..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy - Forgiving and open.</SelectItem>
                      <SelectItem value="Hard">Hard - Cautious and requires effort.</SelectItem>
                      <SelectItem value="Expert">Expert - A true challenge to connect.</SelectItem>
                      <SelectItem value="Ultra Hard">Ultra Hard - Skeptical and distant.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>This will determine how the relationship evolves.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Personality...
                </>
              ) : (
                'Begin Journey'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
