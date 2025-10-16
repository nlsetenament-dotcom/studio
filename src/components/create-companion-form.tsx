
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition, useEffect } from 'react';

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
import { AppTheme, appThemes } from '@/lib/types';
import { Switch } from './ui/switch';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(50, 'El nombre no puede exceder los 50 caracteres.'),
  residence: z.string().min(2, 'El lugar de residencia debe tener al menos 2 caracteres.').max(100, 'El lugar de residencia no puede exceder los 100 caracteres.'),
  gender: z.enum(['Masculino', 'Femenino'], { required_error: 'Por favor selecciona un género.' }),
  birthDay: z.string().min(1, 'Día es requerido.').max(2),
  birthMonth: z.string().min(1, 'Mes es requerido.').max(2),
  birthYear: z.string().min(4, 'Año debe tener 4 dígitos.').max(4),
  hobbies: z.string().min(3, 'Los pasatiempos deben tener al menos 3 caracteres.').max(200, 'Los pasatiempos no pueden exceder los 200 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.').max(500, 'La descripción no puede exceder los 500 caracteres.'),
  theme: z.custom<AppTheme>(value => Object.keys(appThemes).includes(value as string), {
    message: 'Por favor selecciona un tema válido.',
  }),
}).refine(data => {
    const day = parseInt(data.birthDay, 10);
    const month = parseInt(data.birthMonth, 10);
    const year = parseInt(data.birthYear, 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}, {
    message: "La fecha de nacimiento no es válida.",
    path: ["birthDay"],
});

export default function CreateCompanionForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { saveCompanion, appearance, setAppearance, previewTheme } = useCompanion();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      residence: '',
      hobbies: '',
      description: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      theme: 'sunset-orange',
    },
  });

  const themeValue = form.watch('theme');

  useEffect(() => {
    // This is for live theme preview
    previewTheme(themeValue);
  }, [themeValue, previewTheme]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
        const { birthDay, birthMonth, birthYear, ...rest } = values;
        const day = parseInt(birthDay, 10);
        const month = parseInt(birthMonth, 10);
        const year = parseInt(birthYear, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 ) {
             toast({
              variant: 'destructive',
              title: 'Fecha Inválida',
              description: 'Por favor introduce una fecha de nacimiento válida.',
            });
            return;
        }
        
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');

        const birthDate = new Date(`${year}-${formattedMonth}-${formattedDay}T00:00:00`);
        if (isNaN(birthDate.getTime())) {
            toast({
                variant: 'destructive',
                title: 'Fecha Inválida',
                description: 'La fecha de nacimiento proporcionada no es válida.',
            });
            return;
        }

      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
          formData.append(key, String(value));
      });
      formData.append('birthDate', birthDate.toISOString());


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
              name="residence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar de Residencia</FormLabel>
                  <FormControl>
                    <Input placeholder="p. ej., Madrid, España o Buenos Aires, Argentina" {...field} />
                  </FormControl>
                  <FormDescription>Esto influirá en sus experiencias y su forma de hablar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <div className="grid grid-cols-3 gap-3 mt-2">
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
                 <FormMessage>
                    {form.formState.errors.birthDay?.message}
                 </FormMessage>
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
                    <Textarea placeholder="Describe su personalidad, qué los hace únicos..." className="min-h-[100px] rounded-xl" {...field} />
                  </FormControl>
                  <FormDescription>Esta es la base sobre la que la IA construirá su personalidad completa.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4 rounded-lg border bg-background/50 p-4">
              <h3 className="text-lg font-medium">Personalización Visual</h3>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema de la Aplicación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tema visual" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(appThemes).map(([key, theme]) => (
                          <SelectItem key={key} value={key}>{theme.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Elige la paleta de colores para tu experiencia.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex flex-row items-center justify-between rounded-lg py-2">
                <div className="space-y-0.5">
                  <FormLabel>Modo Oscuro</FormLabel>
                  <FormDescription>
                    Disfruta de una interfaz más oscura.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={appearance === 'dark'}
                    onCheckedChange={(checked) => setAppearance(checked ? 'dark' : 'light')}
                  />
                </FormControl>
              </FormItem>
            </div>
            
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

    