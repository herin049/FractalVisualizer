
# Fractal Visualizer

<p align="center">
A simple but powerful fractal visualizer built with React.
</p>


![mandlebrot](https://user-images.githubusercontent.com/40302054/130337421-941c3da8-d56a-40f0-a6d3-9ac7ed9dea40.png)

## Demo
An in browser demo can be viewed [here](https://herin049.github.io/fractalvisualizer/)

## Overview

### Introduction

A [fractal](https://mathworld.wolfram.com/Fractal.html) can be intuitively described as an object that exhibits self similarity at multiple scales.
The [Mandlebrot](https://mathworld.wolfram.com/MandelbrotSet.html) set is one of the most famous fractals and one of the main fractals featured in this application.
The Mandlebrot set can be described mathematically as the set of all points <strong>C</strong> in the complex plane such that the orbit of the recurrence equation
<p align="center"><strong>z<sub>n+1</sub>=z<sub>n</sub><sup>2</sup>+C</strong></p>
starting at <strong>z<sub>0</sub>=0</strong> remains bounded. The simplest methods for coloring the Mandlebrot set involve coloring points in the set a given color and
assigning a variety of colors to points outside the set depending on how fast they escape.

### Features
  * Parallalization using JavaScript [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
  * Computation caching using off screen canvases 
  * Support for the Mandlebrot set and some of its variations (Burning Ship, Multi-brot, Tricorn)
  * Pan and zoom support for both Desktop and Mobile
  * Continuous coloring
### Future work
  * More sophisticated coloring algorithms including histogram coloring and [exterior distance estimation](https://en.wikibooks.org/wiki/Fractals/Iterations_in_the_complex_plane/demm)
  * Add WebGL support for better performance
  * Apply various anti-alising technique (ex. supersampling) for better image quality

### Installation
  [Node](https://nodejs.org/en/) is the only requirement to run the application locally. To get started simply clone the repository and install the required dependencies by running 
  ```bash
    npm install
  ```
  Then, to run the dev server simply run
  ```bash
    npm start
  ```
  or build the project by running
  ```bash
    npm run-script build
  ```



## Acknowledgements
* [Plotting algorithms for the Mandelbrot set](https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set)
* [Mandlebrot set](https://en.wikipedia.org/wiki/Mandelbrot_set)
* [Mandelbrot set - Techniques for computer generated pictures](https://www.math.univ-toulouse.fr/~cheritat/wiki-draw/index.php/Mandelbrot_set)
