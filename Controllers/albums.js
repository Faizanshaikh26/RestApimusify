const express = require("express");
const Album = require("../models/Album");


const allAlbums = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "title",
    order = "asc",
    genre,
    artist,
  } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (artist) filter["songs.artist"] = artist;

  try {
    const albums = await Album.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 });

    const count = await Album.countDocuments(filter);
    res.json({
      albums,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const allAlbumsById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Cannot find album" });
    }
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAlbum = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ message: "Cannot find album" });
    }

    const updatedAlbum = await album.save();
    res.json(updatedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Cannot find album" });
    }
    await album.deleteOne(); // Corrected method
    res.json({ message: "Deleted album", album: album });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const newAlbum = async (req, res) => {
  const album = new Album({
    title: req.body.title,
    description: req.body.description,
    genre: req.body.genre,
    albumImage: req.body.albumImage,
    songs: req.body.songs,
  });
  try {
    const newAlbum = await album.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const searchAlbums = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const query = {};

    if (searchTerm) {
      query.$or = [
        { title: new RegExp(searchTerm, "i") }, // Case-insensitive regex search on title
        { description: new RegExp(searchTerm, "i") }, // Case-insensitive regex search on description
        { genre: new RegExp(searchTerm, "i") }, // Case-insensitive regex search on genre
        { albumImage: new RegExp(searchTerm, "i") }, // Case-insensitive regex search on albumImage
        { "songs.title": new RegExp(searchTerm, "i") }, // Case-insensitive regex search on song titles
        { "songs.artist": new RegExp(searchTerm, "i") }, // Case-insensitive regex search on song artists
      ];
    }

    const albums = await Album.find(query);
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  allAlbums,
  allAlbumsById,
  newAlbum,
  updateAlbum,
  deleteAlbum,
  searchAlbums,
};
