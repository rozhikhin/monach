<?php

namespace App\Http\Controllers;

use App\Models\Marker;
use Illuminate\Http\Request;
use mysql_xdevapi\Exception;

class MarkerController extends Controller
{
    public function all()
    {
        return 555;
        return Marker::all();
    }

    public function store(Request $request): array
    {
        try {
            $marker = Marker::create($request->all());
            return [
                'message' => 'Success',
                'id' =>  $marker->id
            ];
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }

    }

    public function update(Request $request, int $id)
    {
        $marker = Marker::find($id);
        try {
            $marker->update($request->all());
            return [
                'message' => 'Success',
            ];
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $marker = Marker::find($id);
        try {
            $marker->delete();
            return [
                'message' => 'Success',
            ];
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }
    }
}
