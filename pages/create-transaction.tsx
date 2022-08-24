import { useState, ReactNode } from 'react';
import CreateTransactionForm from '@/components/CreateTransactionForm';

export default function Account() {
  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Create Transaction
          </h1>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xl font-semibold">
          <div>
            <CreateTransactionForm />
          </div>
        </div>
      </div>
    </section>
  );
}
