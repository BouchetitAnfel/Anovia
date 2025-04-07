<?php

namespace App\Http\Controllers\API\Employees\Admins;

use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class StockManagementController extends Controller{
    public function StockList(){
        $stocks = DB::table('stock')
        ->select('id', 'qte', 'id_product', 'product_type', 'qualite', 'id_manager', 'date_enter', 'location')
        ->get();
        return response()->json($stocks);
    }


    public function AddStock(Request $request){
        $validated = $request->validate([
            'qte' => 'required|integer',
            'id_product' => 'required|integer',
            'product_type' => 'required|in:furniture,electronics,supplies',
            'qualite' => 'required|string',
            'id_manager' => 'nullable|exists:employees,id',
            'date_enter' => 'required|date',
            'location' => 'required|string',
        ]);

        $stock = Stock::create($validated);
        return response()->json(['message' => 'Stock added successfully', 'data' => $stock], 201);

    }
}

