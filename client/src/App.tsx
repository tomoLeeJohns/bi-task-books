import React from "react";
import AddBook from "./components/AddBook";
import SearchForm from "./components/SearchBook";
import { Container, Tab, Tabs } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    event.preventDefault();
    setTabIndex(newIndex);
  };

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Container>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Add Book" />
            <Tab label="Search Books" />
          </Tabs>

          {tabIndex === 0 && <AddBook />}
          {tabIndex === 1 && <SearchForm />}
        </Container>
      </QueryClientProvider>
    </div>
  );
}

export default App;
