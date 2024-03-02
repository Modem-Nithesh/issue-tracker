"use client";
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchema";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
  });


 type IssueForm = z.infer<typeof createIssueSchema>
const NewIssuePage =  () => {
  const { register, control, handleSubmit, formState: {errors} } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  });
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSumbit = handleSubmit(async data => {
    try {
        await axios.post('/api/issues', data);
        router.push('/issues')
        setIsSubmitting(true)
        
    } catch (error) {
        setError('An Unexpected error occurred')
        setIsSubmitting(false)
    }
   
    
})



  return (

    <div className="max-w-xl">
       { error && <Callout.Root color="red" className="mb-5"> 
        <Callout.Text>{error}</Callout.Text>
         
        </Callout.Root>}

        <form className="space-y-3" onSubmit={onSumbit}>
      <TextField.Root>
        <TextField.Input placeholder="Title" {...register("title")} />
      </TextField.Root>
      <ErrorMessage>{errors.title?.message}</ErrorMessage>
      {/* {errors.title && <Text color="red" as="p">{errors.title.message}</Text>} */}

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="description" {...field} />
        )}
      />

      <ErrorMessage>{errors.description?.message}</ErrorMessage>

      {/* {errors.description && <Text color="red" as="p">{errors.description.message}</Text>} */}

      <Button disabled={isSubmitting}>Submit new issue {isSubmitting && <Spinner />}</Button>
    </form>
    </div>
    
  );
};

export default NewIssuePage;
