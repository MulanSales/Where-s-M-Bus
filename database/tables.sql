Create table Paradas(
  id int unsigned primary key,
  Nome varchar(100),
  Descricao varchar(100),
  Latitude decimal(8,6),
  Longitude decimal(8,6),
  index idx_latitude(Latitude),
  index idx_longitide(Longitude)
)

Load data infile "stops.txt" on table Paradas
