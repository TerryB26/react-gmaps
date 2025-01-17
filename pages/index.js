import PageHeader from "@/components/General/PageHeader"
import { Box, Button } from "@mui/material"
import { CiLogin } from "react-icons/ci"
import Link from 'next/link'

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <PageHeader routeName="G-MAPS Activity Finder" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mt: 2
        }}
      >
        <Link href="/Dashboard" passHref>
          <Button
            variant="outlined"
            sx={{
              mx: 1,
              color: "#1976D2",
              borderColor: "#1976D2",
              '&:hover': {
                backgroundColor: "#1976D2",
                color: "white",
                borderColor: "#1976D2",
                '& .MuiButton-endIcon': {
                  color: "white"
                }
              }
            }}
            endIcon={<CiLogin />}
          >
            Get Started
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default Home;