<?php

namespace App\Console\Commands;

use App\Models\Employee;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SetEmployeePasswords extends Command
{
    protected $signature = 'employees:set-passwords';
    protected $description = 'Set default passwords for employees who don\'t have one';

    public function handle()
    {
        $count = 0;

        $employees = Employee::whereNull('password')->orWhere('password', '')->get();

        foreach ($employees as $employee) {
            // Set default password as first part of email before @
            $emailParts = explode('@', $employee->Email);
            $defaultPassword = $emailParts[0] . '123';

            $employee->password = Hash::make($defaultPassword);
            $employee->save();

            $this->info("Set password for employee: {$employee->Email}");
            $count++;
        }

        $this->info("Completed! Set passwords for {$count} employees.");

        return Command::SUCCESS;
    }
}
