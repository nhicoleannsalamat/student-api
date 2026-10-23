<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // GET /api/students
    public function index()
    {
        return response()->json(Student::latest()->get());
    }

    // GET /api/students/{student}
    public function show(Student $student)
    {
        return response()->json($student);
    }
}