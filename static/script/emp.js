window.onload = function() {
	
  function requestEmprestimosAndamento() {
    //set spinner
	document.getElementsByClassName("emprestimos-grid")[0].innerHTML =
      '<img class="spinner" src="static/image/spinner.gif" />';
	//requisição lsitar emprestimos  
    fetch("/listar-empretimos-andamento/", { method: "POST" })
      .then(response => {
        response.json()
          .then(response => response)
          .then(data => {
			  //tratar resposta
            document.getElementsByClassName("emprestimos-grid")[0].innerHTML = "";
            let i = 0;
            for (let emp in data) {
              //tem de ser pela tag!!

              document.getElementsByClassName("emprestimos-grid")[0].innerHTML += `							
				<div class="emprestimo">
				    <img class="holding-key-icon" src="static/image/key.png" />
				    <div class="emprestimo-sub-section">
				
				        <div class="line">
				            <span class="standard-label">RESPONSÁVEL:</span><span class="label-data" id=""> ${data[emp]["nome"]}</span>
				        </div>
				        <div class="line">
				            <span class="standard-label">CONTATO:</span><span class="label-data" id=""> ${data[emp]["contato"]}</span>
				        </div>
				        <div class="line">
				            <span class="standard-label">CHAVE:</span><span class="label-data" id=""> ${data[emp]["sala"]}</span>
				        </div>
				        <div class="line">
				            <span class="standard-label">EMPRÉSTIMO:</span><span class="label-data" id=""> ${data[emp]["dt_hr_emprestimo"]}
				</span>
				        </div>
 				       <form method="POST" class="devolver-form" action="/remover-emprestimo/">
				            <input type="hidden" name="cod_emprestimo" value="${data[emp]["id_emprestimo"]}" />
				            <button id="devolver" class="color-btn devolver-btn">DEVOLVER CHAVE</button>
				        </form>
				    </div>
				
				</div>`;
				//event para remover emprestimo (form botao)
              document.getElementsByClassName("devolver-form")[i].addEventListener("submit", e => {
                  e.preventDefault();
				  alert(e.target.getElementsByTagName("input"));
                  fetch("/remover-emprestimo/", {
                    headers: new Headers({
                      "content-type": "application/x-www-form-urlencoded"
                    }),
                    body:
                      "cod_emprestimo=" +
                      e.target.querySelector("input").value,
                    method: "POST"
                  }).then(() => {
					  
                    requestEmprestimosAndamento();
                  });
                  
                });
              i += 1;
            }
          });
      })
      .catch(err => {});
  }
//requisição de novo-emprestimo (form emprestar blur)
	document.getElementById("form-novo-emprestimo").addEventListener("submit", e => {
      e.preventDefault();
      fetch("/novo-emprestimo/", {
        headers: new Headers({
          "content-type": "application/x-www-form-urlencoded"
        }),
        body:
          "novo-emprestimo-cpf=" +
          document.getElementsByName("novo-emprestimo-cpf")[0].value +
          "&nome-emprestimo-sala=" +
          document.getElementsByName("nome-emprestimo-sala")[0].value,
        method: "POST"
      }).then(() => {
        requestEmprestimosAndamento();
        document.querySelector("#blur-novo-emprestimo").classList.add("invisible");
        if (document.offsetHeight >= window.innerHeight) {
          document.body.style.overflow = "scroll";
        }
      });
    });

  // botao nav novo emprestimo
  document.querySelector("#novo-emprestimo-btn").addEventListener("click", e => {
      e.preventDefault();
      document.querySelector("#blur-novo-emprestimo").classList.remove("invisible");
      document.body.style.overflow = "hidden";
    });
  //close blur novo emprestimo
  document.querySelector(".header-blur img").addEventListener("click", () => {
    document.querySelector("#blur-novo-emprestimo").classList.add("invisible");
    if (document.offsetHeight >= window.innerHeight) {
      document.body.style.overflow = "scroll";
    }
  });

  requestEmprestimosAndamento();
};
