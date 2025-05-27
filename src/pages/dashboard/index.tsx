import { Button, Flex, Space, Typography } from "antd"
import { EVENTS, ChangePetSpiritPayload } from "../../constants/event"
import { emitTo } from "@tauri-apps/api/event"
import { pokemons } from "../../assets"
import { useEffect, useState } from "react"
import "./index.css"



export default function Dashboard() {




  return (
    <Flex className="dashboard-container" vertical gap={24}>
      <Typography.Text style={{ fontSize: 24, fontWeight: 600 }}>Pokemons</Typography.Text>
      <Flex wrap="wrap" gap={24}>
        {pokemons.map((pokemon) => (
          <Flex key={pokemon.index} vertical gap={4} style={{ width: 100 }}>
            <img src={pokemon.src} alt={pokemon.name_zh} style={{ width: 100, height: 100 }}/>
            <Typography.Text style={{ fontSize: 12, textAlign: "center" }}>{pokemon.name_zh}</Typography.Text>
            <Button
              type="primary"
              onClick={() => {
                emitTo("main", EVENTS.CHANGE_PET_SPIRIT, { spirit: pokemon.src } as ChangePetSpiritPayload)
              }}
            >
              Choose
            </Button>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}