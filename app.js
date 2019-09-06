// begin screener code
const returnValues = [
  "Hakuna",
  "Matata",
  "It means",
  "No worries",
  "For the rest of your days"
].sort(() => (Math.random() > 0.5 ? 1 : -1));

const createService = (retVal, index) => () =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log(`${index}. ${retVal}`);
      resolve(retVal);
    }, Math.random() * 10000)
  );
const services = returnValues.map(createService);
// end screener code

// Build rows dynamically
const renderRacer = (racer, status = "Pending") => {
  return `<div class="item">
                <img class="ui avatar image tiny" src="https://i.ytimg.com/vi/3NENtrX31VI/hqdefault.jpg" />
                <div class="content">
                    <h3 class="header">${racer}</h3>
                    <div id="${racer}-status">
                        <strong>Status:</strong> <span class="ui red basic label">${status}</span>
                    </div>
                </div>
            </div>`;
};

// Update racer status as promises complete
const updateRacerStatus = (racer, rank) => {
  // find status field
  const racerStatus = document.getElementById(`${racer}-status`);

  // Declare winner html
  const winnerHTML = '<div class="ui green tag label">We have a winner</div>';

  // Updat status
  racerStatus.innerHTML = `<strong>Status:</strong> 
                <span class="ui green basic label">Finished 
                    <span class="ui green label circular">
                        ${rank}
                    </span>
                    
                </span>
                
                ${rank === 1 ? winnerHTML : ""}`;
};

// Initialize application
const init = async () => {
  // Store application state
  let state = {
    winner: "",
    rank: 0
  };

  // Get dom elements
  const raceContainer = document.getElementsByClassName("race-container")[0];
  const raceRestartBtn = document.getElementById("restart-button");

  raceRestartBtn.classList.add("disabled");

  // Reset the container - important for restart
  raceRestartBtn.addEventListener("click", init);

  // Build raeer HTML
  const listHtml = returnValues.sort().map(val => renderRacer(val));

  // Append all HTML to DOM
  raceContainer.innerHTML = listHtml.join("");

  // Call all promises Repalce forEach with .map to return an array of Promises
  const servicePromises = services.map(async (service, index) => {
    // Return promise
    const racer = await service();

    // Save winner
    if (state.rank === 0) state.winner = racer;

    // Update rank
    state.rank++;

    // Update racer status
    updateRacerStatus(racer, state.rank);

    // Return value
    return racer;
  });

  // Await all promises to complete
  await Promise.all(servicePromises);

  // Enable restart button
  raceRestartBtn.classList.remove("disabled");
};

document.addEventListener("DOMContentLoaded", init);
