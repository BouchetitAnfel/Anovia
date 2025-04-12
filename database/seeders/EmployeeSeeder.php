class EmployeeSeeder extends Seeder
{
    public function run()
    {
        // From Current Change (but fixed syntax)
        Employee::factory(10)->create();
        
        // From Both Changes (merged)
        Employee::updateOrCreate(
            ['email' => '3bda9a@example.com'],
            [
                'first_name' => '3bda9a',
                'last_name' => 'yoo',
                'Adresse' => 'AinTouta', // or 'AinTouts' if you prefer
                'ccp' => '12345',
                'role' => 'manager',
                'hire_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // From Incoming Change
        Employee::updateOrCreate([
            'first_name' => 'someone',
            'last_name' => 'haha',
            'email' => 'someonehaha@example.com',
            'password' => Hash::make('password123'),
            'adresse' => 'Some Address',
            'ccp' => 123456,
            'role' => 'admin',
            'hire_date' => now(),
        ]);
    }
}