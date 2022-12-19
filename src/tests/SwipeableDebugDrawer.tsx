import * as React from 'react';
import {Global} from '@emotion/react';
import {styled} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {grey} from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {LightDarkThemeSwitch} from "./Learning";
import {Divider, Grid, Input, Stack, Switch, Tab, Tabs, useTheme} from "@mui/material";
import Store from "../libs/sql/logic/misc/Store";
import {Environment} from "../libs/sql/logic/Environment";
import SwipeableViews from "react-swipeable-views";
import {TabPanel} from "../libs/sql/logic/misc/TabPanel";
import {App} from "../libs/sql/deprecated/App";

const drawerBleeding = 56;

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    // backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
    backgroundColor: theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
    backgroundColor: theme.palette.background.default,
}));

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export default function SwipeableDebugDrawer(props: Props) {
    const { window } = props;
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    // This is used only for the example
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(100% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>Debug panel</Typography>
                </StyledBox>
                <StyledBox
                    sx={{
                        // todo find correct
                        // px: 1,
                        px: 0,
                        pb: 2,
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    {/* Debug panel content stack */}
                    <Stack spacing={1} height={"100%"}>
                        <FullWidthTabs />
                    </Stack>
                </StyledBox>
            </SwipeableDrawer>
        </Root>
    );
}

export const FullWidthTabs: React.FC = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <Box sx={{ width: "100%", height: "100%"}} height={"100%"}>
            <Tabs sx={{ borderBottom: 1, borderColor: 'divider'}}
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="scrollable prevent tabs example"
            >
                <Tab label="General" {...a11yProps(0)} />
                <Tab label="Design" {...a11yProps(1)} />
                <Tab label="Stores" {...a11yProps(2)} />
                <Tab label="LocalStore" {...a11yProps(3)} />
                <Tab label="Account" {...a11yProps(4)} />
                <Tab label="Endpoint" {...a11yProps(5)} />
            </Tabs>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                className={"debug-tab-view"}
                height={"100%"}
            >
                {/* Theme switcher tab */}
                <TabPanel value={value} index={0} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* Power actions */}
                            <Stack spacing={1}>
                                <Typography>Power actions</Typography>
                                <Button variant={"outlined"} onClick={() => Store.defStore().get<App>("app")?.forceUpdate()}>Rerender App</Button>
                                <Button variant={"outlined"} onClick={() => {
                                    Environment.constants.defaultEnvironmentDebugData.showDebugPanel = !Environment.constants.defaultEnvironmentDebugData.showDebugPanel;
                                    Store.defStore().get<App>("app")?.forceUpdate()
                                }}>Toggle debug panel</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </TabPanel>
                {/* Theme switcher tab */}
                <TabPanel value={value} index={1} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* Theme switcher */}
                            <Grid container spacing={0}>
                                <Grid item xs={9}>
                                    <Typography variant={"subtitle1"}>Switch themes</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <LightDarkThemeSwitch onClick={() => {
                                        const store: Store = Store.defStore();
                                        const visualData: Environment.EnvironmentVisualData = store.get("visual-config") as Environment.EnvironmentVisualData;
                                        if (visualData.activeTheme === "light") {
                                            visualData.activeTheme = "dark";
                                            store.set("visual-config", visualData);
                                        } else {
                                            visualData.activeTheme = "light";
                                            store.set("visual-config", visualData);
                                        }
                                    }}/>
                                </Grid>
                            </Grid>
                            {/* Main Color chooser */}
                            <Grid container spacing={0}>
                                <Grid item xs={9}>
                                    <Typography variant={"subtitle1"}>Primary</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Input type={"color"} fullWidth={true} onChange={event => {
                                        // todo fix
                                        // Environment.constants.themes.forEach((theme, key) => {
                                        //     theme.palette.primary.main = event.target.value;
                                        // });
                                    }}/>
                                </Grid>
                            </Grid>
                            {/* Success Color chooser */}
                            <Grid container spacing={0}>
                                <Grid item xs={9}>
                                    <Typography variant={"subtitle1"}>Success</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Input type={"color"} fullWidth={true} onChange={event => {
                                        // todo fix
                                        // Environment.constants.themes.forEach((theme, key) => {
                                        //     theme.palette.success.main = event.target.value;
                                        // });
                                    }}/>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* Stores */}
                        </Stack>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={3} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* LocalStore */}
                        </Stack>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={4} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* Account */}
                        </Stack>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={5} direction={theme.direction}>
                    <Box paddingTop={1} sx={{px: 1}} height={"100%"}>
                        <Stack spacing={1} divider={<Divider/>}>
                            {/* Endpoint */}
                        </Stack>
                    </Box>
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
