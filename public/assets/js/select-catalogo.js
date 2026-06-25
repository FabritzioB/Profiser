const selects =
document.querySelectorAll(".custom-select");

selects.forEach(select => {

    const button =
    select.querySelector(".select-btn");

    const options =
    select.querySelectorAll(".option");

    button.addEventListener("click", () => {

        document
        .querySelectorAll(".custom-select")
        .forEach(item => {

            if(item !== select){
                item.classList.remove("active");
            }

        });

        select.classList.toggle("active");
    });

    options.forEach(option => {

        option.addEventListener("click", () => {

            options.forEach(o =>
                o.classList.remove("active")
            );

            option.classList.add("active");

            button.querySelector("span").textContent =
            option.textContent;

            select.classList.remove("active");

            console.log(
                option.dataset.value
            );

        });

    });

});

document.addEventListener("click", e => {

    if(!e.target.closest(".custom-select")){

        document
        .querySelectorAll(".custom-select")
        .forEach(select =>
            select.classList.remove("active")
        );

    }

});