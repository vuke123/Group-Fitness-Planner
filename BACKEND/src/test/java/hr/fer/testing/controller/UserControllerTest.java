package hr.fer.testing.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import static org.mockito.Mockito.when;

import hr.fer.progi.additions.RequestDeniedException;
import hr.fer.progi.controller.RestExceptionHandler;
import hr.fer.progi.controller.UserController;
import hr.fer.progi.model.User;
import hr.fer.progi.services.interfaces.UserService;
import hr.fer.testing.util.UserGeneratingUtil;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.runner.RunWith;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.mockito.Mockito.doThrow;




@RunWith(MockitoJUnitRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mvc;

    private String message;

    private ModelMapper modelMapper;

    private ObjectMapper objectMapper;

    private UserController userController;

    @Mock
    private UserService userService;


    @Before
    public void setup() {
        modelMapper = new ModelMapper();
        objectMapper = new ObjectMapper();
        JacksonTester.initFields(this, new ObjectMapper());
        this.userController = new UserController();
        userController.setUserService(userService);
        mvc = MockMvcBuilders.standaloneSetup(userController)
                .setControllerAdvice(new RestExceptionHandler()).build();
    }

    @Test
    public void testCreatingNewTrainerSuccessfully() throws Exception{

        User mockUser = UserGeneratingUtil.createMockUSer();

        when(userService.newTrainer(mockUser)).thenReturn("success");

        mvc.perform(post("/new-trainer").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(mockUser))).
                 andExpect(status().isOk())
                .andExpect(content().string(("success")));
    }
    @Test
    public void testCreatingNewTrainerUnsuccessfully() throws Exception {
        User mockUser = UserGeneratingUtil.createMockUSer();

        when(userService.newTrainer(mockUser)).thenThrow(new RequestDeniedException("Username: " + mockUser.getUsername() + " is already taken."));

        mvc.perform(post("/new-trainer").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsBytes(mockUser))).
                andExpect(status().is4xxClientError());
    }


}
