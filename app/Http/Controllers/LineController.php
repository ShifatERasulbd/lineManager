<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Line;
use Illuminate\Http\JsonResponse;

class LineController extends Controller
{
    //
    public function index():JsonResponse
    {
        $result =Line::orderBy('line_number')->get();
        return response()->json($result);   
    }

    public function show($id):JsonResponse

    {
        $line =Line::find($id);
        if($line){
            return response()->json($line);
        }else{
            return response()->json(['message'=>'Line Not Found'],404);
        }
    }

    public function store(Request $request):JsonResponse
    {
        $validation=$request->validate([
            'line_number'=>'required|unique:lines',
        ]);

        $line=Line::create($validation);
        return response()->json($line,201);
    }

    public function update(Request $request,$id):JsonResponse
    {
        $line=Line::find($id);
        if($line){
            $validation =$request->validate([
                'line_number'=>'required|unique:lines,line_number,'.$id,
            ]);
            $line->update($validation);
            return response()->json($line);
        }else{
            return response()->json(['message'=>'Line Not Found'],404);
        }
    }

    public function destroy($id):JsonResponse
    {
        $line=Line::find($id);
        if ($line){
            $line->delete();
            return response()->json(['message'=>'Line Deleted']);
        }else{
            return response()->json(['message'=>'Line Not Found'],404);
        }
    }
}
