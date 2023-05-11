"use client";

import '../styles/global.css';

import { z } from 'zod';
import React from 'react';
import { useState } from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('O nome deve ser obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  email: z.string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine(email => {
      return email.endsWith('@gmail.com')
    }, 'O email precisa ser da Google'),
  password: z.string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)
  }))
    .min(2, 'Insira pelo menos 2 Tecnologias')
    .max(8, 'Insira no máximo 8 Tecnologia')
    .refine(techs => {
      return techs.some(tech => tech.knowledge > 50)
    }, 'Você está aprendendo')
  })

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export default function Page() {
  const [ output, setOutput ] = useState('')
  const { 
      register, 
      handleSubmit, 
      formState: {errors},
      control,
    } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    rules: { minLength: 2},
    control,
    name: 'techs',
    
  })

  function addTech () {
    append({
      title: '',
      knowledge: 0
    })
  }
    
  function removeTech(){
    let index = fields.length - 1;
    remove(index)
  }

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main 
      className="h-full py-10 bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center"
      >
      <form 
        onSubmit={handleSubmit(createUser)} 
        className="flex flex-col gap-4 w-full max-w-xs">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Nome Completo</label>
            <input 
              type="text"
              className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
              {...register('name')}
            />
            {errors.name && <span className='text-red-500 text-xs'>{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail Google</label>
          <input 
            type="email"
            className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register('email')}
          />
          {errors.email && <span className='text-red-500 text-xs'>{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register('password')}
            />
            {errors.password && <span className='text-red-500 text-xs'>{errors.password.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="techs" className='flex items-center justify-between'>
            Tecnologias
            <button 
              onClick={addTech}
              className="text-emerald-500"
            >
              Adicionar
            </button>
            </label>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <input 
                      type="text" 
                      className=" border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                      {...register(`techs.${index}.title` as const)}
                  />
                  {errors.techs?.[index]?.title && <span className='text-red-500 text-xs'>{errors.techs?.[index]?.title?.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input 
                    type="number" 
                    className="w-16 border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`techs.${index}.knowledge` as const)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-xs'>{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>
              </div>
            )
          })}
          {errors.techs && <span className='text-red-500 text-xs'>{errors.techs.message}</span>}
          {fields.length > 0 && <button onClick={removeTech} className="text-emerald-500"> Remover </button>}
        </div>
        <button 
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          >Salvar</button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}
