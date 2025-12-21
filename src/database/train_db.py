from src.logic.graph_bfs import Graph
import json
import os

class TrainDB:
    def __init__(self, path: str, fetch_data: bool = True):
        self.folder_path = path
        self.__data = Graph()
        if fetch_data:
            self.fetch()

    def fetch(self, intersection_filename:s tr = "_intersections.json") -> None:
        with os.scandir(self.folder_path) as entries:
            for entry in entries:
                ext = entry.name[entry.name.find('.') + 1:]
                #_intersections.json is handled separately
                if entry.is_file() and ext == 'json' and entry.name[0] != '_':
                    temp_dict = self.fetch_entry(entry.name)
                    self.__add_stations(temp_dict["stations"])
       
        intersection_dict = self.fetch_entry(intersection_filename)
        self.__add_intersections(intersection_dict)
        
    def fetch_entry(self, entry_name: str) -> dict:
        temp_dict = {}
        with open(entry_name, 'r') as file:
            temp_dict = json.load(file)
        return temp_dict

    def __add_stations(self, stations: list[str]) -> None:
        """
            In this case, the stations are assumed to be connected end-to-end
            i.e. ["A", "B", "C"], the graph looks like A <-> B <-> C
        """

        for station in stations:
            self.__data.add_vertex(station)
        for i in range(len(stations) - 1):
            station_a = stations[i]
            station_b = stations[i + 1]
            self.__data.add_edge(station_a, station_b)

    def __add_intersections(self, intersects: dict) -> None:
        for it in intersects:
            self.__data.add_vertex(it)
            self.__data.add_edge(it["station1"], it)
            self.__data.add_edge(it["station2"], it)
