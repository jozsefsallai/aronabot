use crate::data::Data;
use crate::handlers::{build_skills_embed, build_student_embed};
use poise::serenity_prelude as serenity;
use serenity::all::{
    ComponentInteraction, Context as SerenityContext, CreateInteractionResponse,
    CreateInteractionResponseMessage, EditInteractionResponse,
};

pub async fn handle_component(ctx: &SerenityContext, interaction: &ComponentInteraction, data: &Data) {
    let custom_id = &interaction.data.custom_id;
    let Some((prefix, student_id)) = custom_id.split_once('_') else {
        return;
    };

    // Only handle our known button prefixes
    if prefix != "skills" && prefix != "student" {
        return;
    }

    // Restrict to original interaction user when available
    let original_user_id = interaction
        .message
        .interaction_metadata
        .as_ref()
        .and_then(|meta| match meta.as_ref() {
            serenity::MessageInteractionMetadata::Command(cmd) => Some(cmd.user.id),
            serenity::MessageInteractionMetadata::Component(comp) => Some(comp.user.id),
            _ => None,
        });

    if let Some(original_user_id) = original_user_id {
        if original_user_id != interaction.user.id {
            let _ = interaction
                .create_response(
                    &ctx.http,
                    CreateInteractionResponse::Message(
                        CreateInteractionResponseMessage::new()
                            .content("You cannot use this button.")
                            .ephemeral(true),
                    ),
                )
                .await;
            return;
        }
    }

    let students = data.containers.students.read().await;
    let Some(student) = students.get_student(student_id) else {
        let _ = interaction
            .create_response(
                &ctx.http,
                CreateInteractionResponse::Message(
                    CreateInteractionResponseMessage::new().content("Student not found."),
                ),
            )
            .await;
        return;
    };

    let portrait_base = data
        .config
        .r2_public_access_url
        .as_deref()
        .unwrap_or("https://aronabot.cdn.nimblebun.works");

    let response = match prefix {
        "skills" => match build_skills_embed(student, portrait_base) {
            Ok((embed, row)) => EditInteractionResponse::new()
                .content("")
                .embeds(vec![embed])
                .components(vec![row]),
            Err(msg) => EditInteractionResponse::new()
                .content(msg)
                .embeds(Vec::<serenity::CreateEmbed>::new())
                .components(Vec::<serenity::CreateActionRow>::new()),
        },
        "student" => {
            let (embed, components) = build_student_embed(student, portrait_base);
            let mut edit = EditInteractionResponse::new()
                .content("")
                .embeds(vec![embed]);
            if let Some(row) = components {
                edit = edit.components(vec![row]);
            } else {
                edit = edit.components(Vec::<serenity::CreateActionRow>::new());
            }
            edit
        }
        _ => return,
    };

    drop(students);

    // Defer update then edit
    if let Err(e) = interaction
        .create_response(&ctx.http, CreateInteractionResponse::Acknowledge)
        .await
    {
        // If already acknowledged path fails, try update directly
        tracing::warn!("button acknowledge failed: {e}");
    }

    if let Err(e) = interaction.edit_response(&ctx.http, response).await {
        tracing::error!("button edit failed: {e}");
    }
}