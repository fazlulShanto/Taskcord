import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const defaultCookies = [
  { key: 'test1', value: 'value1' },
  { key: 'test2', value: 'value2' },
];

export const CookieForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      cookies: defaultCookies,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cookies',
  });

  const onSubmit = async (data: { cookies: typeof defaultCookies }) => {
    const cookies = data.cookies.reduce((old, cookie) => {
      if (!cookie.key || !cookie.value) return old;
      return { ...old, [cookie.key]: cookie.value };
    }, {});
    //
    const res = await HttpClient.post(APIs.utility.cookies(), cookies);
    console.log(res);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 flex gap-2">
          <Controller
            control={control}
            name={`cookies.${index}.key`}
            render={({ field }) => (
              <input {...field} placeholder="Key" className="rounded border p-2" />
            )}
          />
          <Controller
            control={control}
            name={`cookies.${index}.value`}
            render={({ field }) => (
              <input {...field} placeholder="Value" className="rounded border p-2" />
            )}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded bg-red-500 px-3 py-2 text-white"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ key: '', value: '' })}
        className="mr-2 rounded bg-blue-500 px-3 py-2 text-white"
      >
        Add Cookie
      </button>
      <button type="submit" className="rounded bg-green-500 px-3 py-2 text-white">
        Submit
      </button>
    </form>
  );
};
