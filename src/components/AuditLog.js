import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { getAuditLog } from "../api";

export default function AuditLog({ users = [] }) {
  const [rows, setRows] = useState([]);
  const [action, setAction] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    getAuditLog({
      action,
      q: q || undefined,
      limit: 200,
    })
      .then((r) => setRows(r.data || []))
      .catch(() => {});
  }, [action, q]);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" fontWeight={900}>
          Journal d’audit
        </Typography>

        <Typography color="text.secondary">
          Historique des activités enregistrées localement dans cet espace.
        </Typography>
      </div>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
          >
            <TextField
              size="small"
              placeholder="Rechercher dans les activités…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <Select
              size="small"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <MenuItem value="all">
                Toutes les actions
              </MenuItem>

              {[
                ["create", "Créer"],
                ["update", "Modifier"],
                ["delete", "Supprimer"],
                ["assign", "Assigner"],
                ["move", "Déplacer"],
                ["comment", "Commenter"],
              ].map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            {rows.map((activity) => (
              <Stack
                key={activity.id}
                direction="row"
                justifyContent="space-between"
                gap={2}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <div>
                  <Typography fontWeight={750}>
                    {activity.message}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {activity.user?.name || "Système"} ·{" "}
                    {activity.createdAt
                      ? new Date(activity.createdAt).toLocaleString()
                      : ""}
                  </Typography>
                </div>

                <Chip
                  size="small"
                  label={activity.action}
                />
              </Stack>
            ))}

            {!rows.length && (
              <Typography color="text.secondary">
                Aucune activité trouvée.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}


