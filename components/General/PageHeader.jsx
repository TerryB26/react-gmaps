import { Box, Divider, Typography } from "@mui/material";
import React from "react";
 
const PageHeader = ({ routeName = "Route Name Required" }) => {
  const routeParts = routeName.split(" ");
 
  return (
    <Box sx={{ position: "relative" }}>
      {routeParts.length === 1 ? (
        <Divider>
          <Typography
            variant="h2"
            sx={{ color: "#1f2c47", textAlign: "center" }}
          >
            {routeParts[0]}
          </Typography>
        </Divider>
      ) : (
        <>
          <Typography
            variant="h2"
            sx={{ color: "#1f2c47", textAlign: "center" }}
          >
            {routeParts[0]}
          </Typography>
          <Divider>
            <Typography variant="subtitle1" sx={{ color: "#1f2c47" }}>
              {routeParts.slice(1).join(" ")}
            </Typography>
          </Divider>
        </>
      )}
    </Box>
  );
};
 
export default PageHeader;