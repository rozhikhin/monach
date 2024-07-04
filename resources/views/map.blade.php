@extends('welcome')

@section('title', 'Карта')

@section('content')
    <div id="map-wrapper">
        <div id="map">

        </div>
    </div>
    @auth
        <script type="module">
            mmm()
        </script>
    @else
        <script type="module">
            mmm(true)
        </script>
    @endauth
@endsection
