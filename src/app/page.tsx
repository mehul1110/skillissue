'use client';

import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {generateCareerPath} from '@/ai/flows/generate-career-path';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {RoadmapVisualizer} from '@/components/roadmap-visualizer';
import {DownloadRoadmapButton} from '@/components/download-roadmap-button';
import {cn} from '@/lib/utils';

const formSchema = z.object({
  interests: z
    .string()
    .min(2, {
      message: 'Interests must be at least 2 characters.',
    })
    .max(500, {
      message: 'Interests must be less than 500 characters.',
    }),
});

export default function Home() {
  const {toast} = useToast();
  const [careerPaths, setCareerPaths] = useState<
    {title: string; description: string}[]
  >([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState<
    {title: string; description: string} | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await generateCareerPath({interests: values.interests});
      setCareerPaths(result.careerPaths);
      toast({
        title: 'Career paths generated!',
        description: 'Check out the suggestions below.',
      });
    } catch (e: any) {
      console.error('Error generating career path:', e);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error generating the career path.',
      });
    }
  }

  const handleCareerPathClick = (careerPath: {
    title: string;
    description: string;
  }) => {
    setSelectedCareerPath(careerPath);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Discover Your Ideal Career Path
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interest Profiler</CardTitle>
            <CardDescription>
              Tell us about your interests, hobbies, and skills to discover
              potential career paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="interests"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Your Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., coding, writing, public speaking"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your interests, hobbies, and skills separated by
                        commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Generate Career Paths</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Career Path Suggestions</CardTitle>
              <CardDescription>
                Explore the suggested career paths based on your interests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerPaths.length > 0 ? (
                careerPaths.map((careerPath, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCareerPathClick(careerPath)}
                  >
                    <h3 className="font-semibold">{careerPath.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {careerPath.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No career paths generated yet. Please submit your interests
                  to see suggestions.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedCareerPath && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-4">
            Roadmap for {selectedCareerPath.title}
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Visualizer</CardTitle>
              <CardDescription>
                Visualize the steps, skills, and resources needed for your
                selected career.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoadmapVisualizer careerPath={selectedCareerPath.title} />
            </CardContent>
            <CardFooter className="justify-between">
              <DownloadRoadmapButton
                roadmapContent={selectedCareerPath.title}
              />
              <p className="text-sm text-muted-foreground">
                Download the roadmap for offline access.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
