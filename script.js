let movieList = [];

document.getElementById('upload').addEventListener('change', function(event) {
  const reader = new FileReader();
  reader.onload = function(event) {
    mammoth.extractRawText({ arrayBuffer: event.target.result })
      .then(function(result) {
        movieList = result.value.split('\n').map(line => line.trim()).filter(Boolean);
        alert(`Found ${movieList.length} movies`);
      });
  };
  reader.readAsArrayBuffer(event.target.files[0]);
});

async function getMovieData(title) {
  const apiKey = 'f49e4b48'; // <-- Replace with your real OMDb API key
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "True") {
    return [data.Title, data.Year, data.imdbRating];
  } else {
    return [title, 'N/A', 'N/A'];
  }
}

async function generateCSV() {
  if (!movieList.length) {
    alert("Please upload a valid .docx file first.");
    return;
  }

  const rows = [["Movie Name", "Year", "Rating"]];
  for (let movie of movieList) {
    const row = await getMovieData(movie);
    rows.push(row);
  }

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.getElementById("downloadLink");
  link.href = url;
  link.download = "movie_ratings.csv";
  link.style.display = "inline-block";
}
