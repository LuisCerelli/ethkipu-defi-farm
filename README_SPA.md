# Proyecto: Simple DeFi Yield Farming

## ✨ Descripción General

Este proyecto implementa una versión simplificada de un sistema de **Yield Farming (Token Farm)** al estilo de plataformas como PancakeSwap. Utiliza tres contratos inteligentes desarrollados en Solidity:

* `LPToken.sol`: Token de proveedor de liquidez (LP), el activo que los usuarios depositan en la Farm.
* `DAPToken.sol`: Token de la plataforma (DAPP), que se distribuye como recompensa.
* `FarmProportionalBonus.sol`: Contrato principal de la Farm, donde ocurre el staking, distribución de recompensas y retiros.

El sistema está alineado con los objetivos y bonuses definidos por el ejercicio "Simple DeFi Yield Farming".

---

## 📂 Contratos

### `LPToken.sol`

Contrato ERC20 que representa el token LP (Liquidity Provider). Incluye:

* Nombre: "LP Token"
* Símbolo: "LP"
* Funcionalidad `mint(address, uint256)` accesible por el owner

> Es el token que los usuarios depositan en el contrato `FarmProportionalBonus` para hacer staking.

---

### `DAPToken.sol`

Contrato ERC20 que representa el token de recompensas de la plataforma. Incluye:

* Nombre: "DApp Token"
* Símbolo: "DAP"
* Funcionalidad `mint(address, uint256)` accesible por el owner

> Se utiliza como recompensa al hacer staking. El contrato de la Farm recibe un balance de DAPP previamente mintiado por el owner para distribuir.

---

### `FarmProportionalBonus.sol`

Contrato principal de la Farm:

* Permite a los usuarios:

  * Depositar LP tokens (`deposit()`)
  * Retirar LP tokens (`withdraw(uint256)`)
  * Reclamar recompensas acumuladas (`claimRewards()`)
* Permite al owner:

  * Cambiar la recompensa por bloque (`setRewardPerBlock()`)
  * Cambiar la comisión de retiro (`setWithdrawalFee()`)
  * Retirar comisiones acumuladas (`withdrawTreasury()`)
  * Distribuir recompensas globalmente (`distributeRewardsAll()`)

#### Estructura

* `struct Staker`: contiene `amount`, `rewardDebt`, `lastBlock`
* `mapping(address => Staker) public stakers`
* `uint256 rewardPerBlock`, `uint256 withdrawalFee`, `uint256 treasury`

#### Características Bonus Implementadas

* ✅ **Bonus 1: Modifier**

  * `onlyStaker`: valida si el usuario está en staking
  * `onlyOwner`: propietario del contrato

* ✅ **Bonus 2: Struct**

  * Se reemplazaron los mappings por un `Staker` struct

* ✅ **Bonus 3: Pruebas unitarias completas**

* ✅ **Bonus 4: Recompensas variables**

  * Se puede actualizar `rewardPerBlock`

* ✅ **Bonus 5: Comisión de retiro**

  * Retenciones sobre `claimRewards`, acumuladas en `treasury`

---

## ✅ Tests realizados (`FarmProportionalBonus.test.ts`)

Los tests se escribieron con Hardhat + Ethers v6 y cubren los siguientes escenarios:

1. ✅ **Acuñar tokens LP y depositar**

   * Se prueba `mint()` y `deposit()`
   * Se verifica que los LP tokens se trasladan correctamente a la Farm

2. ✅ **Distribución proporcional de recompensas**

   * Se simulan `evm_mine()` para crear bloques
   * Se comparan los `rewardDebt` entre dos usuarios

3. ✅ **Reclamo de recompensas**

   * Se mintian tokens DAPP al contrato
   * Se verifica que `claimRewards()` transfiere tokens y actualiza el `rewardDebt`

4. ✅ **Withdraw de LP y permanencia de recompensas**

   * Se prueba `withdraw(uint256)`
   * Se verifica que los LP se devuelven y las recompensas se mantienen reclamables

---

## 🔁 Scripts disponibles (`/scripts`)

Estos scripts TypeScript automatizan tareas frecuentes durante el desarrollo, testing y despliegue de la Token Farm.

| Archivo                       | Descripción                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `deploy.ts`                   | Despliega `LPToken`, `DAPToken` y `FarmProportionalBonus` en red local.                                  |
| `deploy_farm_proportional.ts` | Despliega solamente el contrato `FarmProportionalBonus`. Útil si ya tienes tokens creados.               |
| `mint.ts`                     | Acuña tokens LP a una cuenta determinada.                                                                |
| `mint_and_deposit.ts`         | Acuña LP tokens y los deposita en la Farm en una sola operación.                                         |
| `mint_dap_to_farm.ts`         | Acuña tokens DAPP y los transfiere al contrato `FarmProportionalBonus` para distribución de recompensas. |
| `claim_and_withdraw.ts`       | Permite a un usuario reclamar recompensas y luego retirar su staking.                                    |
| `balance.ts`                  | Muestra balances actuales de LP y DAPP para una dirección específica.                                    |

### 🛠 Uso (ejemplo)

```bash
npx hardhat run scripts/mint_and_deposit.ts --network localhost
```

> 📌 Tip: Puedes modificar los scripts fácilmente para usar en Sepolia, Goerli u otra testnet.

---

## 💡 Instrucciones de uso

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Compilar contratos

```bash
npx hardhat compile
```

### 3. Correr los tests

```bash
npx hardhat test
```

### 4. Desplegar localmente (opcional)

```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

---

¡Perfecto! Vamos a añadir una nueva sección al final del README llamada `🌐 Interfaz Web (Frontend)` para reflejar lo que hiciste con React + ethers. Aquí tienes la versión modificada que puedes pegar justo antes de la sección `📅 Enlaces de referencia`:

---

## 🌐 Interfaz Web (Frontend)

Se desarrolló una interfaz sencilla con **React + ethers.js** (sin librerías adicionales) que permite interactuar fácilmente con el contrato `FarmProportionalBonus` desplegado en la red **Sepolia**.

### 🧩 Funcionalidades disponibles

Desde el navegador, un usuario puede:

* ✅ Conectar su wallet Metamask
* ✅ Visualizar su balance de LP y DAPP tokens
* ✅ Depositar 50 LP tokens
* ✅ Retirar 50 LP tokens
* ✅ Reclamar recompensas generadas
* ✅ Consultar recompensas pendientes

### 🗂 Estructura del frontend

* Carpeta: `/token-farm-frontend`
* Archivo principal: `App.tsx`
* Contratos: ABI de `FarmProportionalBonus`, `LPToken` y `DAPToken` ubicados en la carpeta `/abi`
* Dirección de contratos: leídas desde `deployed_addresses.json`

### 🚀 Instrucciones para correr el frontend

```bash
cd token-farm-frontend
npm install
npm run dev
```

> Asegúrate de tener Metamask conectada a Sepolia y fondos suficientes para realizar interacciones.

## 📅 Enlaces de referencia

* Documentación PancakeSwap: [https://docs.pancakeswap.finance/products/yield-farming/how-to-use-farms](https://docs.pancakeswap.finance/products/yield-farming/how-to-use-farms)
* ERC20 OpenZeppelin: [https://docs.openzeppelin.com/contracts/4.x/api/token/erc20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)

---

## ✉ Autor

**Luis Alberto Cerelli**
Proyecto desarrollado como parte del curso de Ethereum/Web3 - ETH-KIPU.
