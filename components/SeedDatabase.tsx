import React from 'react';

const SeedDatabase = () => {
  const seedDb = async () => {
    console.log('seeding database');
    const response = await fetch('/api/create-demo-data');
    console.log(response);
  };
  return (
    <div>
      <button onClick={seedDb}>Seed Database</button>
    </div>
  );
};

export default SeedDatabase;
