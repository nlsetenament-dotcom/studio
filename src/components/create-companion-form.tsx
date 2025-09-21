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
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(50, 'El nombre no puede exceder los 50 caracteres.'),
  gender: z.enum(['Masculino', 'Femenino'], { required_error: 'Por favor selecciona un género.' }),
  age: z.coerce.number({ required_error: 'La edad es requerida.' }).int().min(18, 'Debe tener al menos 18 años.').max(100, 'La edad no puede exceder los 100 años.'),
  hobbies: z.string().min(3, 'Los pasatiempos deben tener al menos 3 caracteres.').max(200, 'Los pasatiempos no pueden exceder los 200 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.').max(500, 'La descripción no puede exceder los 500 caracteres.'),
  difficulty: z.enum(['Easy', 'Hard', 'Expert', 'Ultra Hard'], { required_error: 'Por favor selecciona una dificultad.' }),
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
          title: 'Creación Fallida',
          description: result.error,
        });
      } else if (result.success && result.companion) {
        saveCompanion(result.companion);
        toast({
          title: '¡Compañero Creado!',
          description: `Prepárate para conocer a ${result.companion.name}.`,
        });
        router.push('/chat');
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Crea tu Compañero</CardTitle>
        <CardDescription>Diseña la personalidad y antecedentes de tu nuevo amigo IA.</CardDescription>
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
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="p. ej., Lucía, Alex" {...field} />
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
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="p. ej., 25" {...field} />
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
                  <FormLabel>Género</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un género" />
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
                  <FormLabel>Pasatiempos</FormLabel>
                  <FormControl>
                    <Input placeholder="p. ej., Leer, senderismo, tocar el piano" {...field} />
                  </FormControl>
                  <FormDescription>Separa los pasatiempos con una coma.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historia / Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe su personalidad, qué los hace únicos..." className="min-h-[100px]" {...field} />
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
                  <FormLabel>Dificultad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel de dificultad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Fácil - Permisivo y abierto.</SelectItem>
                      <SelectItem value="Hard">Difícil - Cauteloso y requiere esfuerzo.</SelectItem>
                      <SelectItem value="Expert">Experto - Un verdadero desafío para conectar.</SelectItem>
                      <SelectItem value="Ultra Hard">Ultra Difícil - Escéptico y distante.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Esto determinará cómo evoluciona la relación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Personalidad...
                </>
              ) : (
                'Comenzar Viaje'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
