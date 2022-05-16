import { CommandInteraction } from 'discord.js'
import commandSuccessEmbedBuilder from '../../builders/commandSuccessEmbedBuilder'
import * as distube from '../../clients/distube'

import * as voice from '../../common/voice'

export async function execute(interaction: CommandInteraction) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const guildId = interaction.guildId!
    const queue = distube.client.getQueue(guildId)
    voice.userCheck(interaction, queue)
    if (interaction.replied) return
    voice.songCheck(interaction, queue)
    if (interaction.replied) return

    enum Repeat {
        off,
        song,
        queue,
    }

    let result

    if (interaction.options.getString('mode')) {
        result = distube.client.setRepeatMode(
            guildId,
            (<never>Repeat)[
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                interaction.options.getString('mode')!.toLowerCase()
            ]
        )
    } else {
        result = distube.client.setRepeatMode(guildId)
    }

    await interaction.reply({
        embeds: [
            new commandSuccessEmbedBuilder().create(
                `Repeat mode is set to ${Repeat[result]}`
            ),
        ],
    })
}