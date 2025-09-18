/* eslint-disable */
"use client";
import { axisBottom, axisLeft } from "d3-axis"; // D3 is a JavaScript library for data visualization: https://d3js.org/
import { csv } from "d3-fetch";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";

// Example data: Only the first three rows are provided as an example
// Add more animals or change up the style as you desire

// TODO: Write this interface
interface AnimalDatum {
  name: string;
  speed: number;
  diet: "herbivore" | "carnivore" | "omnivore";
}

export default function AnimalSpeedGraph() {
  // useRef creates a reference to the div where D3 will draw the chart.
  // https://react.dev/reference/react/useRef
  const graphRef = useRef<HTMLDivElement>(null);

  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  // TODO: Load CSV data
  useEffect(() => {
    csv("/sample_animals.csv").then((data) => {
      let dataTemp = [];
      for (let i = 0; i < data.length; i++) {
        let datum: AnimalDatum = {
          name: data[i]?.["Animal"] || "",
          speed: parseFloat(data[i]?.["Average Speed (km/h)"] || "0"),
          diet: data[i]?.["Diet"] as "herbivore" | "carnivore" | "omnivore",
        };
        dataTemp.push(datum);
      }
      setAnimalData(dataTemp);

      // we are only interested animals with highest speeds.
      let herbivoeres: AnimalDatum[] = dataTemp.filter((d) => d.diet === "herbivore");
      herbivoeres.sort((a, b) => b.speed - a.speed);

      let carnivores: AnimalDatum[] = dataTemp.filter((d) => d.diet === "carnivore");
      carnivores.sort((a, b) => b.speed - a.speed);

      let omnivores: AnimalDatum[] = dataTemp.filter((d) => d.diet === "omnivore");
      omnivores.sort((a, b) => b.speed - a.speed);

      let toDisplay = [...omnivores.slice(0, 5), ...carnivores.slice(0, 5), ...herbivoeres.slice(0, 5)];
      setAnimalData(toDisplay);

      console.log(toDisplay);
    });
  }, []);

  useEffect(() => {
    // Clear any previous SVG to avoid duplicates when React hot-reloads
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    if (animalData.length === 0) return;

    // Set up chart dimensions and margins
    const containerWidth = graphRef.current?.clientWidth ?? 800;
    const containerHeight = graphRef.current?.clientHeight ?? 500;

    // Set up chart dimensions and margins
    const width = Math.max(containerWidth, 600); // Minimum width of 600px
    const height = Math.max(containerHeight, 400); // Minimum height of 400px
    const margin = { top: 70, right: 60, bottom: 80, left: 100 };

    // Create the SVG element where D3 will draw the chart
    // https://github.com/d3/d3-selection
    const svg = select(graphRef.current!).append<SVGSVGElement>("svg").attr("width", width).attr("height", height);

    // TODO: Implement the rest of the graph
    // HINT: Look up the documentation at these links
    // https://github.com/d3/d3-scale#band-scales
    // https://github.com/d3/d3-scale#linear-scales
    // https://github.com/d3/d3-scale#ordinal-scales
    // https://github.com/d3/d3-axis

    // band scales with d3
    const xScale = scaleBand([100, width]).domain(animalData.map((d) => d.name));
    let speeds: number[] = animalData.map((d) => d.speed) as number[];
    let maxSpeed: number = Math.max(...speeds) as number;
    console.log(maxSpeed);
    const yScale = scaleLinear()
      .domain([0, maxSpeed])
      .range([height - 20, 0]);

    // axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - 20})`)
      .call(axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${100},0)`)
      .call(axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Speed (km/h)")
      .style("fill", "currentColor");

    // add the bars
    svg
      .selectAll("rect")
      .data(animalData)
      .enter()
      .append("rect")
      .attr("x", (d) => (xScale(d.name) as number) + 10)
      .attr("y", (d) => yScale(d.speed) as number)
      .attr("width", xScale.bandwidth() - 20)
      .attr("height", (d) => (height - 20 - yScale(d.speed)) as number)
      .attr("fill", (d) => {
        switch (d.diet) {
          case "herbivore":
            return "lightgreen";
          case "carnivore":
            return "salmon";
          case "omnivore":
            return "goldenrod";
        }
      });

    // create legend
    svg
      .append("circle")
      .attr("cx", width - 120)
      .attr("cy", 20)
      .attr("r", 6)
      .style("fill", "goldenrod");
    svg
      .append("circle")
      .attr("cx", width - 120)
      .attr("cy", 50)
      .attr("r", 6)
      .style("fill", "salmon");
    svg
      .append("circle")
      .attr("cx", width - 120)
      .attr("cy", 80)
      .attr("r", 6)
      .style("fill", "lightgreen");
    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", 20)
      .text("Omnivores")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle")
      .style("fill", "currentColor");
    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", 50)
      .text("Carnivores")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle")
      .style("fill", "currentColor");
    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", 80)
      .text("Herbivores")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle")
      .style("fill", "currentColor");
  }, [animalData]);

  // TODO: Return the graph
  return <div ref={graphRef}></div>;
}
