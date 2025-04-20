<?php

namespace App\Http\Controllers\API\Employees\Admins;

use App\Models\Stock;
use Illuminate\Http\Request;
use App\Events\LowStockEvent;
use App\Events\HighStockEvent;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class StockManagementController extends Controller{

    const DEFAULT_LOW_THRESHOLD = 10;
    const DEFAULT_HIGH_THRESHOLD = 100;
    public function StockList(){
        $stocks = DB::table('stock')
        ->select('id', 'qte', 'id_product', 'product_type', 'qualite', 'id_manager', 'date_enter', 'location')
        ->get();
        return response()->json($stocks);
    }


    public function AddStock(Request $request)
    {
        $validated = $request->validate([
            'qte' => 'required|integer',
            'id_product' => 'required|integer',
            'product_type' => 'required|in:furniture,electronics,supplies',
            'qualite' => 'required|string',
            'id_manager' => 'nullable|exists:employees,id',
            'date_enter' => 'required|date',
            'location' => 'required|string',
            'low_threshold' => 'nullable|integer',
            'high_threshold' => 'nullable|integer',
        ]);

        // Get thresholds based on product type if not provided
        if (!isset($validated['low_threshold']) || !isset($validated['high_threshold'])) {
            $thresholds = $this->getThresholdsByProductType($validated['product_type']);
            $validated['low_threshold'] = $validated['low_threshold'] ?? $thresholds['low'];
            $validated['high_threshold'] = $validated['high_threshold'] ?? $thresholds['high'];
        }

        $stock = Stock::create($validated);

        // Capture stock alerts for the response
        $alerts = $this->checkStockLevelsWithResponse($stock);

        return response()->json([
            'message' => 'Stock added successfully',
            'data' => $stock,
            'stock_alerts' => $alerts
        ], 201);
    }
    private function getThresholdsByProductType($productType)
    {
    // You could replace this with a database lookup if you want to make it configurable
        $thresholds = [
            'furniture' => ['low' => 5, 'high' => 50],
            'electronics' => ['low' => 15, 'high' => 75],
            'supplies' => ['low' => 20, 'high' => 200],
        ];

        return $thresholds[$productType] ?? ['low' => self::DEFAULT_LOW_THRESHOLD, 'high' => self::DEFAULT_HIGH_THRESHOLD];
    }

    private function checkStockLevelsWithResponse(Stock $stock)
    {
        $alerts = [];

        // Get total quantity for this product
        $totalQty = Stock::where('id_product', $stock->id_product)
            ->sum('qte');

        // Get thresholds from the stock item or use defaults
        $lowThreshold = $stock->low_threshold ?? self::DEFAULT_LOW_THRESHOLD;
        $highThreshold = $stock->high_threshold ?? self::DEFAULT_HIGH_THRESHOLD;

        // Check if stock is too low
        if ($totalQty <= $lowThreshold) {
            $alerts[] = [
                'type' => 'LOW_STOCK',
                'product_id' => $stock->id_product,
                'current_quantity' => $totalQty,
                'threshold' => $lowThreshold,
                'message' => "Stock level is below minimum threshold"
            ];
            event(new LowStockEvent($stock, $totalQty, $lowThreshold));
        }

        // Check if stock is too high
        if ($totalQty >= $highThreshold) {
            $alerts[] = [
                'type' => 'HIGH_STOCK',
                'product_id' => $stock->id_product,
                'current_quantity' => $totalQty,
                'threshold' => $highThreshold,
                'message' => "Stock level exceeds maximum threshold"
            ];
            event(new HighStockEvent($stock, $totalQty, $highThreshold));
        }

        return $alerts;
    }
}
