'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { appThemes, AppTheme } from '@/lib/types';
import { createCompanionAction } from '@/lib/actions';
import { useCompanion } from '@/hooks/use-companion';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(50, 'El nombre no puede tener más de 50 caracteres.'),
  residence: z.string().min(2, 'La residencia debe tener al menos 2 caracteres.').max(100, 'La residencia no puede tener más de 100 caracteres.'),
  gender: z.enum(['Masculino', 'Femenino'], {
    required_error: 'Por favor selecciona un género.',
  }),
  birthDay: z.string().min(1, 'Día es requerido.').max(2, 'Día inválido.'),
  birthMonth: z.string().min(1, 'Mes es requerido.').max(2, 'Mes inválido.'),
  birthYear: z.string().min(4, 'Año debe tener 4 dígitos.').max(4, 'Año debe tener 4 dígitos.'),
  hobbies: z.string().min(3, 'Los pasatiempos deben tener al menos 3 caracteres.').max(200, 'Los pasatiempos no pueden tener más de 200 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.').max(500, 'La descripción no puede tener más de 500 caracteres.'),
  theme: z.custom<AppTheme>(val => Object.keys(appThemes).includes(val as string), {
    message: 'Por favor selecciona un tema válido.',
  }),
  appearance: z.boolean().default(false), // false for light, true for dark
}).refine(data => {
  const day = parseInt(data.birthDay, 10);
  const month = parseInt(data.birthMonth, 10);
  const year = parseInt(data.birthYear, 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}, {
  message: "La fecha de nacimiento no es válida.",
  path: ["birthDay"], // Or birthMonth, birthYear
});

export default function CreateCompanionForm() {
  const router = useRouter();
  const { saveCompanion, appearance, setAppearance, previewTheme } = useCompanion();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      residence: '',
      gender: undefined,
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      hobbies: '',
      description: '',
      theme: 'sunset-orange',
      appearance: appearance === 'dark',
    },
  });

  const selectedTheme = form.watch('theme');

  useEffect(() => {
    previewTheme(selectedTheme);
  }, [selectedTheme, previewTheme]);

  useEffect(() => {
    form.setValue('appearance', appearance === 'dark');
  }, [appearance, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAppearance(values.appearance ? 'dark' : 'light');
    
    const formData = new FormData();

    const { birthDay, birthMonth, birthYear, ...restOfValues } = values;
    const birthDate = `${birthMonth}/${birthDay}/${birthYear}`;

    Object.entries(restOfValues).forEach(([key, value]) => {
        if(key !== 'appearance' && value !== undefined) {
            formData.append(key, value.toString());
        }
    });
    formData.append('birthDate', birthDate);
    formData.append('birthDay', birthDay);
    formData.append('birthMonth', birthMonth);
    formData.append('birthYear', birthYear);

    const result = await createCompanionAction(formData);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error al crear',
        description: result.error,
      });
    } else if (result.success && result.companion) {
      saveCompanion({...result.companion, theme: values.theme });
      toast({
        title: '¡Compañero Creado!',
        description: `${result.companion.name} está listo para conversar.`,
      });
      router.push('/chat');
    }
  }

  return (
    <motion.main 
      className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Crea tu Compañero</CardTitle>
          <CardDescription>Diseña la personalidad y antecedentes de tu nuevo amigo IA.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Alex" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar de Residencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Madrid, España" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="birthDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="Día" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="Mes" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="Año" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormMessage>{form.formState.errors.birthDay?.message}</FormMessage>
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pasatiempos</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Leer, senderismo, tocar la guitarra" {...field} />
                    </FormControl>
                     <FormDescription>
                        Enumera algunos pasatiempos separados por comas.
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Breve</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe a tu compañero: ¿es tímido, extrovertido, gracioso, serio?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                        Esta es la base que la IA usará para construir su personalidad.
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema de Color</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tema para la aplicación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(appThemes).map(([key, theme]) => (
                               <SelectItem key={key} value={key}>{theme.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Esto cambiará la paleta de colores de la app.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="appearance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apariencia</FormLabel>
                          <div className='flex items-center space-x-2 rounded-md border p-2 h-10'>
                              <Sun className="h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Moon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        <FormDescription>
                          Elige entre el modo claro y el oscuro.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Compañero
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.main>
  );
}
