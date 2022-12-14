/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
// import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrUpdate, getDetail } from "api/school";
import uploadImg from "api/upload";
import AlertMessage from "components/AlertMessage";

function SchoolForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id"); // if id is not set, it's add
  const isAdd = id == null;
  const [name, setName] = useState("");
  const [enName, setEnName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("成功");
  const [alertMessage, setAlertMessage] = useState("");
  const [image, setImage] = useState("");

  const init = () => {
    setName("");
    setEnName("");
    setImage("");
  };

  const save = async () => {
    let imgUrl = image;
    if (image !== "" && document.getElementById("image").files.length > 0) {
      imgUrl = await uploadImg(document.getElementById("image").files[0], "school");
    }
    const result = await addOrUpdate(id || -1, name, enName, imgUrl);
    if (result.res_code < 0) {
      setAlertSeverity("错误");
      setAlertMessage(result.msg);
    } else {
      setAlertSeverity("成功");
      setAlertMessage(`已成功 ${isAdd ? "添加" : "更新"}`);
      if (isAdd === true) init();
    }
    setAlertOpen(true);
  };

  const loadDetailInfo = async () => {
    const result = await getDetail(id);
    if (result.res_code < 0) {
      setAlertSeverity("错误");
      setAlertMessage(result.msg);
      setAlertOpen(true);
    } else {
      setName(result.msg.name);
      setEnName(result.msg.en_name);
      setImage(result.msg.img_url);
    }
  };

  useEffect(() => {
    if (!isAdd) {
      loadDetailInfo();
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} md={12} sx={{ textAlign: "right" }} mb={2} mr={2}>
        <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
          <Icon>arrow_left</Icon>&nbsp; 返回
        </MDButton>
      </Grid>
      <MDBox px={1} width="100%" height="100vh" mx="auto" my={15}>
        <Grid container spacing={1} justifyContent="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2} textAlign="center">
                    <MDBadge color="info">{isAdd ? "创建" : "编辑"}</MDBadge>
                  </MDBox>
                  {/* School Id */}
                  {!isAdd && (
                    <MDBox mb={2}>
                      <Grid container spaing={2} mt={2} mb={3}>
                        <Grid item>
                          <MDTypography variant="h6" fontWeight="regular" color="text">
                            学校ID:&nbsp;&nbsp;&nbsp;
                          </MDTypography>
                        </Grid>
                        <Grid item sm={8}>
                          <MDTypography variant="h6" fontWeight="medium" color="text">
                            {id}
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </MDBox>
                  )}
                  {/*  */}
                  {/* Image */}
                  <MDBox mb={2}>
                    <Grid container spaing={2}>
                      <Grid item mr={1}>
                        <MDButton variant="contained" component="label" color="success" fullWidth>
                          图标
                          <input
                            type="file"
                            id="image"
                            hidden
                            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                          />
                        </MDButton>
                      </Grid>
                      <Grid item sm={3}>
                        <MDBox component="img" src={image} shadow="lg" width="100%" />
                      </Grid>
                    </Grid>
                  </MDBox>
                  {/*  */}
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="中文名称"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="英文名称"
                      fullWidth
                      value={enName}
                      onChange={(e) => setEnName(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={save}>
                      保存
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        severity={alertSeverity}
        message={alertMessage}
      />
    </DashboardLayout>
  );
}

export default SchoolForm;
