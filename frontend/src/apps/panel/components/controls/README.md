# controls

Atomes de formulaire du panel, thème « chapiteau ». Inline-styles ; l'anneau de focus
est porté par la classe globale `.dv-field-input` (définie dans `shared/theme/fonts.css`).

| Export | Rôle |
|---|---|
| `Field` | Bloc vertical « libellé + champ + aide ». |
| `TextInput` | Champ texte standard. |
| `SelectInput` | Liste déroulante (`options: {value,label}[]`) avec flèche dorée. |
| `NumberStepper` | Compteur −/+ borné (`min`/`max`/`step`/`suffix`). |
| `Toggle` | Interrupteur on/off (`role="switch"`). |

Spécifiques au panel (formulaires) : ne pas remonter dans `shared` tant que l'overlay
n'en a pas besoin.
