class ModelGry {
    constructor() 
    {
        this.rusza = "X";
        this.plansza = new Array(9).fill(null);
    }

    nastepnyRusza() 
    {
        this.rusza = this.rusza === "X" ? "O" : "X";
    }

    wykonajRuch(i) 
    {
        if (this.czyKoniecGry()) 
        {
            return;
        }

        if (this.plansza[i]) 
        {
            return;
        }

        this.plansza[i] = this.rusza;

        if (!this.znajdzWygrywajacyUklad()) 
        {
            this.nastepnyRusza();
        }
    }

    znajdzWygrywajacyUklad() 
    {
        const wygrywajaceUklady = 
        [
            [0, 4, 8],
            [2, 4, 6],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];

        for (const uklad of wygrywajaceUklady) 
        {
            const [a, b, c] = uklad;

            if (this.plansza[a] && (this.plansza[a] === this.plansza[b] && this.plansza[b] === this.plansza[c])) 
            {
                return uklad;
            }
        }

        return null;
    }

    czyKoniecGry() 
    {
        return this.znajdzWygrywajacyUklad() || !this.plansza.includes(null);
    }
}

//---------------------------------------------------------------------

class WidokGry {
    constructor(root) {
        this.root = root;
        this.onPoleClick = undefined;
        this.onRestartClick = undefined;

        this.root.querySelectorAll(".plansza_pole").forEach(pole => 
            {
            pole.addEventListener("click", () => 
            {
                if (this.onPoleClick) 
                {
                    this.onPoleClick(pole.dataset.index);
                }
            });
        });

        this.root.querySelector(".header_reset").addEventListener("click", () => {
            if (this.onRestartClick) 
            {
                this.onRestartClick();
            }
        });
    }

    update(gra) 
    {
        this.updateRusza(gra);
        this.updateStan(gra);
        this.updatePlansza(gra);
    }

    updateRusza(gra) 
    {
        this.root.querySelector(".header_rusza").textContent = `Ruch: ${gra.rusza}`;
    }

    updateStan(gra) 
    {
        let status = "GRAMY...";
        if (gra.znajdzWygrywajacyUklad()) {
            status = `KONIEC - ZWYCIĘŻA ${gra.rusza}!`;
        } else if (gra.czyKoniecGry()) {
            status = "REMIS";
        }

        this.root.querySelector(".header_stan").textContent = status;
    }

    updatePlansza(gra) 
    {
        const wygrywajacyUklad = gra.znajdzWygrywajacyUklad();

        for (let i = 0; i < gra.plansza.length; i++) 
        {
            const pole = this.root.querySelector(`.plansza_pole[data-index="${i}"]`);

            pole.classList.remove("plansza_pole--winner");             
            
            pole.textContent = gra.plansza[i];

            if (wygrywajacyUklad && wygrywajacyUklad.includes(i)) 
            {
                pole.classList.add("plansza_pole--winner");
            }
        }
    }
}


//---------------------------------------------------------------------

let modelGry = new ModelGry();
let widokGry = new WidokGry(document.getElementById("app"));


widokGry.onPoleClick = function (i) 
{
    modelGry.wykonajRuch(i);
    widokGry.update(modelGry);
};

widokGry.onRestartClick = function () 
{
    modelGry = new ModelGry();
    widokGry.update(modelGry);
};


widokGry.update(modelGry);

// koniec