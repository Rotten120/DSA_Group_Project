from src.logic.graph_bfs import Graph
from src.logic.travel_weight import TravelWeight
import json
import os

class TrainDB:
    def __init__(self, path: str, fetch_data: bool = True):
        self.folder_path = path
        self.__data = Graph()
        if fetch_data:
            self.fetch()

    def fetch(self, intersection_filename: str = "_intersections.json") -> None:
        with os.scandir(self.folder_path) as entries:
            for entry in entries:
                ext = entry.name[entry.name.find('.') + 1:]
                #_intersections.json is handled separately
                if entry.is_file() and ext == 'json' and entry.name[0] != '_':
                    temp_dict = self.fetch_entry(entry.name)
                    self.__add_stations(temp_dict)
       
        intersection_dict = self.fetch_entry(intersection_filename)
        self.__add_intersections(intersection_dict)
        
    def fetch_entry(self, entry_name: str) -> dict:
        temp_dict = {}
        entry_path = self.abs_path(entry_name)
        with open(entry_path, 'r') as file:
            temp_dict = json.load(file)
        return temp_dict

    def __add_stations(self, stations: list[str]) -> None:
        """
            In this case, the stations are assumed to be connected end-to-end
            i.e. ["A", "B", "C"], the graph looks like A <-> B <-> C
        """

        station_names = stations["stations"]
        station_count = len(station_names)

        for station in station_names:
            self.__data.add_vertex(station)

        for n in range(station_count):
            for m in range(station_count):
                from_station = station_names[n]
                to_station = station_names[m]

                weight = TravelWeight(
                    stations["stored value"][from_station][m],
                    stations["single journey"][from_station][m],
                    stations["time"][from_station][m]
                )
    
                self.__data.add_edge(
                    from_station,
                    to_station,
                    weight
                )

    def __add_intersections(self, intersects: list[dict]) -> None:
        for it in intersects:
            weight = TravelWeight(
                it["stored value"],
                it["single journey"],
                it["time"]
            )

            self.__data.add_edge(
                it["station1"],
                it["station2"],
                weight,
                two_way = True
            )

    def get(self) -> Graph:
        return self.__data

    def abs_path(self, filename: str, ext: str = "") -> str:
        temp_path = self.folder_path + '/' + filename
        if ext:
            temp_path += '.' + ext
        return temp_path
